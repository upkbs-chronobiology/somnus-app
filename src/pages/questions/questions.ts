import * as moment from 'moment';
import { Answer } from '../../model/answer';
import { AnswersProvider } from '../../providers/answers/answers';
import { AnswerType } from '../../model/answer-type';
import { ChangeDetectorRef, Component } from '@angular/core';
import { InclusiveRange } from '../../model/inclusive-range';
import { Moment } from 'moment';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
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

  AnswerType = AnswerType;

  private scheduleManager: ScheduleManager;

  questions: Question[];
  answers: Answer[];
  nextDue: Moment;

  submitting: boolean = false;

  constructor(
    private schedulesProvider: SchedulesProvider,
    private answersProvider: AnswersProvider,
    private questionsProvider: QuestionsProvider,
    private toast: ToastProvider,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.schedulesProvider.listMine().subscribe(schedules => {
      this.scheduleManager = new ScheduleManager(schedules);
      this.loadQuestions();
    });
  }

  private loadQuestions() {
    delete this.questions;

    const recent = this.scheduleManager.mostRecentDue();
    const next = this.scheduleManager.nextDue();
    if (!recent) {
      this.noneDueUntil(next);
      return;
    }
    this.answersProvider.listMineByQuestionnaire(recent.schedule.questionnaireId).subscribe(answers => {
      if (!answers.length) {
        this.prepareQuestions(recent);
        return;
      }
      const sorted = answers.sort((a, b) => a.created - b.created);
      const latestAnswer = moment(sorted[sorted.length - 1].created);
      if (latestAnswer > recent.moment)
        this.noneDueUntil(next);
      else
        this.prepareQuestions(recent);
    });
  }

  private noneDueUntil(next: Prompt) {
    this.questions = [];
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
        if (q.answerType === AnswerType.RangeDiscrete) answer.content = this.rangeCenter(q.answerRange).toString();
        return answer;
      });
    });
  }

  rangeCenter(range: InclusiveRange): number {
    return (range.max - range.min) / 2 + range.min;
  }

  everthingAnswered(): boolean {
    return this.answers && this.answers.every(a => !!a.content);
  }

  submitAnswers(): void {
    this.submitting = true;
    this.answersProvider.sendAll(this.answers).subscribe(createdAnswers => {
      this.submitting = false;
      this.toast.show(`${createdAnswers.length} answers successfully submitted`);
      this.loadQuestions();
    }, error => {
      this.submitting = false;
      this.toast.show(`Answer submission failed: ${error.message || error}`, true);
    });
  }

  isValidAnswer(value: any): boolean {
    return typeof value === 'number' || !!value;
  }
}
