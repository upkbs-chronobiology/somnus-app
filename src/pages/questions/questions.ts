import * as moment from 'moment';
import { Answer } from '../../model/answer';
import { AnswersProvider } from '../../providers/answers/answers';
import { AnswerType } from '../../model/answer-type';
import { ChangeDetectorRef, Component } from '@angular/core';
import { InclusiveRange } from '../../model/inclusive-range';
import { Moment } from 'moment';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Platform } from 'ionic-angular';
import { Prompt, ScheduleManager } from '../../util/schedule-manager';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../../providers/questions/questions';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})
export class QuestionsPage implements OnInit {

  private scheduleManager: ScheduleManager;

  questions: Question[];
  answers: Answer[];
  nextDue: Moment;
  promptBacklog: Prompt[] = [];

  submitting: boolean = false;

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
    this.schedulesProvider.listMine().subscribe(schedules => {
      this.scheduleManager = new ScheduleManager(schedules);

      this.updateNotifications();
      this.platform.resume.subscribe(() => this.updateNotifications());

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
    if (!next) return;

    this.nextDue = next.moment;
    const interval = setInterval(() => {
      // refresh "time until next" indication
      this.changeDetectorRef.detectChanges();

      if (moment() >= next.moment) {
        this.prepareQuestions(next);
        clearInterval(interval);
      }
    }, 10 * 1000);
  }

  private prepareQuestions(prompt: Prompt) {
    this.questionsProvider.listByQuestionnaire(prompt.schedule.questionnaireId).subscribe(questions => {
      this.questions = questions;
      this.answers = questions.map(q => {
        const answer = new Answer(null, q.id);
        // default sliders to center
        if (q.answerType === AnswerType.RangeContinuous) answer.content = this.rangeCenter(q.answerRange).toString();
        if (q.answerType === AnswerType.RangeDiscrete) answer.content = this.rangeCenter(q.answerRange, true).toString();
        return answer;
      });
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
