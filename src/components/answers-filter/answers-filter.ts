import { Component, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { Answer } from '../../model/answer';
import { Question } from '../../model/question';
import { Questionnaire } from '../../model/questionnaire';
import { Schedule } from '../../model/schedule';
import { Study } from '../../model/study';
import { User } from '../../model/user';
import { AnswersProvider } from '../../providers/answers/answers';
import { QuestionnairesProvider } from '../../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../../providers/questions/questions';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { StudiesProvider } from '../../providers/studies/studies';
import { UsersProvider } from '../../providers/users/users';
import { indexBy } from '../../util/arrays';
import { DATE_FORMAT } from '../../util/schedule-analyzer';

@Component({
  selector: 'answers-filter',
  templateUrl: 'answers-filter.html'
})
export class AnswersFilterComponent {

  @Output()
  readonly answersChange: EventEmitter<Map<number, Answer[]>> = new EventEmitter();

  @Output()
  readonly schedulesChange: EventEmitter<Map<number, Schedule[]>> = new EventEmitter();

  @Output()
  readonly toDateChange: EventEmitter<string> = new EventEmitter();

  @Output()
  readonly fromDateChange: EventEmitter<string> = new EventEmitter();

  users: User[];
  studies: Study[];
  questionnaires: Questionnaire[];
  questions: Question[];

  private _study: Study;
  public get study(): Study {
    return this._study;
  }
  public set study(value: Study) {
    this._study = value;

    this.resetAfterStudyChange();
  }

  questionnaire: Questionnaire;
  participants: User[] = [];

  private _fromDate: string;
  public get fromDate(): string {
    return this._fromDate;
  }
  public set fromDate(value: string) {
    this._fromDate = value;
    this.fromDateChange.emit(value);
    this.loadAnswers();
  }

  private _toDate: string;
  public get toDate(): string {
    return this._toDate;
  }
  public set toDate(value: string) {
    this._toDate = value;
    this.toDateChange.emit(value);
    this.loadAnswers();
  }

  constructor(
    usersProvider: UsersProvider,
    studiesProvider: StudiesProvider,
    questionnairesProvider: QuestionnairesProvider,
    questionsProvider: QuestionsProvider,
    private answersProvider: AnswersProvider,
    private schedulesProvider: SchedulesProvider
  ) {
    Observable.combineLatest(
      usersProvider.listAll(),
      studiesProvider.listAll(),
      questionnairesProvider.listAll(),
      questionsProvider.listAll()
    ).subscribe(([users, studies, questionnaires, questions]) => {
      this.users = users;

      this.studies = studies;
      if (studies.length > 0) this.study = studies[0];

      this.questionnaires = questionnaires;
      const forStudy = this.questionnairesForStudy();
      if (forStudy.length > 0) this.questionnaire = forStudy[0];

      this.questions = questions;

      this.loadAnswers();
    });
  }

  refresh() {
    this.loadAnswers();
  }

  private resetAfterStudyChange() {
    const forStudy = this.questionnairesForStudy();
    if (forStudy.length > 0)
      this.questionnaire = forStudy[0];
    else
      this.questionnaire = null;

    // TODO: Keep participants if also part of this study?
    this.participants = [];
  }

  questionnairesForStudy(): Questionnaire[] {
    if (!this.study || !this.questionnaires) return [];

    return this.questionnaires.filter(q => q.studyId === this.study.id);
  }

  loadAnswers() {
    if (!this.questionnaire || !this.questions) {
      this.answersChange.emit(new Map());
      return;
    }

    this.answersProvider.listByQuestionnaire(this.questionnaire.id)
      .subscribe(answers => {
        const participantAnswers = this.filterByParticipants(answers, a => a.userId);
        const timeLimited = this.limitByTime(participantAnswers, a => moment(a.createdLocal));
        const mappedAnswers = indexBy(timeLimited, a => a.questionId);
        this.answersChange.emit(mappedAnswers);
      });

    if (this.schedulesChange.observers.length)
      this.loadSchedules();
  }

  private loadSchedules() {
    this.schedulesProvider.listForQuestionnaire(this.questionnaire.id)
      .subscribe(schedules => {
        const participantSchedules = this.filterByParticipants(schedules, s => s.userId);
        const timeLimited = this.limitByTime(participantSchedules, s => moment(s.startDate), s => moment(s.endDate));
        const mappedSchedules = indexBy(timeLimited, s => s.userId);
        // // There should only be one schedule per user
        // const singleSchedules = transformValues(mappedSchedules, s => s[0]);
        this.schedulesChange.emit(mappedSchedules);
      });
  }

  private filterByParticipants<T>(items: T[], extractId: (t: T) => number) {
    const participantIds = this.participants.map(p => p.id);
    const participantAnswers = items.filter(t => !this.participants.length || participantIds.includes(extractId(t)));
    return participantAnswers;
  }

  private limitByTime<T>(items: T[], extractStart: (t: T) => moment.Moment, extractEnd: (t: T) => moment.Moment = extractStart) {
    return items.filter(t => {
      const start = extractStart(t);
      const end = extractEnd(t);
      if (this.fromDate && end < moment(this.fromDate).startOf('day'))
        return false;
      if (this.toDate && start > moment(this.toDate).endOf('day'))
        return false;
      return true;
    });
  }

  limit7Days() {
    const now = moment();
    this.fromDate = now.clone().subtract(7, 'days').format(DATE_FORMAT);
    this.toDate = moment().format(DATE_FORMAT);
  }

  limit28Days() {
    const now = moment();
    this.fromDate = now.clone().subtract(28, 'days').format(DATE_FORMAT);
    this.toDate = moment().format(DATE_FORMAT);
  }

  unlimitedDates() {
    this.fromDate = null;
    this.toDate = null;
  }
}
