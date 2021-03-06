import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Platform, Slides } from 'ionic-angular';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { Answer } from '../../model/answer';
import { AnswerType } from '../../model/answer-type';
import { InclusiveRange } from '../../model/inclusive-range';
import { Question } from '../../model/question';
import { AnswersProvider } from '../../providers/answers/answers';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { QuestionsProvider } from '../../providers/questions/questions';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { ToastProvider } from '../../providers/toast/toast';
import { Prompt, ScheduleManager } from '../../util/schedule-manager';

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})
export class QuestionsPage implements OnInit {

  @ViewChildren(Slides)
  private slidesInstances: QueryList<Slides>;

  private scheduleManager: ScheduleManager;

  questions: Question[];
  answers: Answer[];
  nextDue: Moment;
  promptBacklog: Prompt[] = [];

  submitting: boolean = false;

  private timeRefreshInterval;

  constructor(
    private schedulesProvider: SchedulesProvider,
    private answersProvider: AnswersProvider,
    private questionsProvider: QuestionsProvider,
    private toast: ToastProvider,
    private changeDetectorRef: ChangeDetectorRef,
    private notifications: NotificationsProvider,
    private platform: Platform
  ) {
  }

  ngOnInit(): void {
    this.fetchSchedules();

    this.platform.resume.subscribe(() => {
      this.fetchSchedules();
    });
  }

  private fetchSchedules() {
    this.schedulesProvider.listMine().subscribe(schedules => {
      if (!this.scheduleManager || !this.scheduleManager.containsExactly(schedules))
        this.scheduleManager = new ScheduleManager(schedules);

      this.updateNotifications();
      this.loadQuestions();
    });
  }

  private updateNotifications() {
    this.notifications.cancelAll().then(() => {
      // only schedule a few to prevent issues with limits (at least on iOS)
      const items = this.scheduleManager.nextNDues(5).map(prompt => ({
        message: 'You have new questions',
        time: prompt.moment
      }));
      this.notifications.schedule(items);
    });
  }

  private loadQuestions() {
    delete this.questions;

    const recents = this.scheduleManager.mostRecentsDue();
    if (!recents.length) {
      this.noneDue();
      return;
    }

    Observable.from(recents).flatMap(recent =>
      this.answersProvider.listMineByQuestionnaire(recent.schedule.questionnaireId)
        .map(answers => this.hasAnswer(recent, answers) ? null : recent))
      .filter(recent => !!recent)
      .catch((err, caught) => {
        this.toast.show(`Loading questions failed: ${err.message || err}`, true);
        return Observable.empty<Prompt>();
      })
      .toArray()
      .subscribe(unansweredRecents => {
        if (!unansweredRecents.length)
          this.noneDue();
        else {
          this.promptBacklog = unansweredRecents;
          this.consumeBacklog();
        }
      });
  }

  private hasAnswer(recent: Prompt, answers: Answer[]): boolean {
    if (!answers.length) return false;

    const sorted = answers.sort((a, b) => a.created - b.created);
    const latestAnswer = moment(sorted[sorted.length - 1].created);
    return latestAnswer > recent.moment;
  }

  private consumeBacklog() {
    if (!this.promptBacklog.length) {
      this.loadQuestions();
      return;
    }

    this.prepareQuestions(this.promptBacklog.shift());
  }

  private noneDue() {
    this.questions = [];

    const next = this.scheduleManager.nextDue();
    this.nextDue = next && next.moment;
    if (!next) return;

    if (!this.timeRefreshInterval)
      this.timeRefreshInterval = setInterval(() => this.refreshTime(), 10 * 1000);
  }

  private refreshTime() {
    // refresh "time until next" indication
    this.changeDetectorRef.detectChanges();

    if (moment() >= this.nextDue) {
      this.prepareQuestions(this.scheduleManager.nextDue());
    }
  }

  private prepareQuestions(prompt: Prompt) {
    clearInterval(this.timeRefreshInterval);
    this.timeRefreshInterval = null;

    this.questionsProvider.listByQuestionnaire(prompt.schedule.questionnaireId).subscribe(questions => {
      this.questions = questions;
      this.answers = questions.map(q => {
        const answer = new Answer(null, q.id);
        // default sliders to center
        if (q.answerType === AnswerType.RangeContinuous) answer.content = this.rangeCenter(q.answerRange).toString();
        if (q.answerType === AnswerType.RangeDiscrete) answer.content = this.rangeCenter(q.answerRange, true).toString();
        return answer;
      });

      // jump to first slide for a new questionnaire to prevent UI glitches
      // FIXME: this.slidesInstances is undefined during tests, hence this guard
      this.slidesInstances && this.slidesInstances.forEach(slides => slides.slideTo(0, 0));
    });
  }

  rangeCenter(range: InclusiveRange, round: boolean = false): number {
    const mean = (range.max - range.min) / 2 + range.min;
    return round ? Math.round(mean) : mean;
  }

  everythingAnswered(): boolean {
    return this.answers && this.answers.every(a => this.isValidAnswer(a.content));
  }

  submitAnswers(): void {
    // update timestamps before sending (might have been generated a while ago)
    this.answers.forEach(a => a.createdLocal = Answer.localTimestamp());

    this.submitting = true;
    this.answersProvider.sendAll(this.answers).subscribe(createdAnswers => {
      this.submitting = false;
      this.toast.show(`${createdAnswers.length} answer${createdAnswers.length === 1 ? '' : 's'} successfully submitted`);
      this.consumeBacklog();

      this.updateNotifications();
    }, error => {
      this.submitting = false;
      this.toast.show(`Answer submission failed: ${error.message || error}`, true);
    });
  }

  isValidAnswer(value: any): boolean {
    if (typeof value === 'string') return value && !!value.trim();

    return typeof value === 'number' || !!value;
  }
}
