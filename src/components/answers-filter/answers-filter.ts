import { Component, EventEmitter, Output } from '@angular/core';
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
  participant: User;

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

    // TODO: Keep participant if also part of this study?
    this.participant = null;
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
        const participantAnswers = answers.filter(a => !this.participant || a.userId === this.participant.id);
        const mappedAnswers = indexBy(participantAnswers, a => a.questionId);
        this.answersChange.emit(mappedAnswers);
      });
  }
}
