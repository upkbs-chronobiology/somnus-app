import { Component, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { Answer } from '../../model/answer';
import { Question } from '../../model/question';
import { Questionnaire } from '../../model/questionnaire';
import { Study } from '../../model/study';
import { User } from '../../model/user';
import { AnswersProvider } from '../../providers/answers/answers';
import { QuestionnairesProvider } from '../../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../../providers/questions/questions';
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
  answersChange: EventEmitter<Map<number, Answer[]>> = new EventEmitter();

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
  fromDate: string;
  toDate: string;

  constructor(
    usersProvider: UsersProvider,
    studiesProvider: StudiesProvider,
    questionnairesProvider: QuestionnairesProvider,
    questionsProvider: QuestionsProvider,
    private answersProvider: AnswersProvider
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
        const participantIds = this.participants.map(p => p.id);
        const participantAnswers = answers.filter(a => !this.participants.length || participantIds.includes(a.userId));
        const timeLimited = participantAnswers.filter(a => {
          const created = moment(a.createdLocal);
          if (this.fromDate && created < moment(this.fromDate).startOf('day')) return false;
          if (this.toDate && created > moment(this.toDate).endOf('day')) return false;
          return true;
        });
        const mappedAnswers = indexBy(timeLimited, a => a.questionId);
        this.answersChange.emit(mappedAnswers);
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