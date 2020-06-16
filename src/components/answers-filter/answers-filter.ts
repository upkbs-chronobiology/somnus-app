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

  study: Study;
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
        const mappedAnswers = answers
          .filter(a => !this.participant || a.userId === this.participant.id)
          .reduce((map: Map<number, Answer[]>, a: Answer) => {
            if (!map.has(a.questionId)) map.set(a.questionId, []);
            map.get(a.questionId).push(a);
            return map;
          }, new Map());

        this.answersChange.emit(mappedAnswers);
      });
  }
}
