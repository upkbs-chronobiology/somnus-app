import { Component } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { Answer } from '../../../model/answer';
import { AnswerType } from '../../../model/answer-type';
import { Question } from '../../../model/question';
import { Questionnaire } from '../../../model/questionnaire';
import { Study } from '../../../model/study';
import { User } from '../../../model/user';
import { AnswersProvider } from '../../../providers/answers/answers';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../../../providers/questions/questions';
import { StudiesProvider } from '../../../providers/studies/studies';
import { UsersProvider } from '../../../providers/users/users';

@Component({
  selector: 'page-answers',
  templateUrl: 'answers.html',
})
export class AnswersPage {

  users: User[];
  studies: Study[];
  questionnaires: Questionnaire[];
  questions: Question[];

  answers: Map<number, Answer[]>;
  questionIdsInScope: number[];

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
      this.answers = new Map();
      return;
    }

    this.answersProvider.listByQuestionnaire(this.questionnaire.id)
      .subscribe(answers => {
        this.answers = answers
          .filter(a => !this.participant || a.userId === this.participant.id)
          .reduce((map: Map<number, Answer[]>, a: Answer) => {
            if (!map.has(a.questionId)) map.set(a.questionId, []);
            map.get(a.questionId).push(a);
            return map;
          }, new Map());

        // This is to avoid "expression changed" errors
        this.questionIdsInScope = Array.from(this.answers.keys());
      });
  }

  renderAnswerContent(answer: Answer): string {
    const question: Question = this.questionById(answer.questionId);
    switch (question.answerType) {
      case AnswerType.Date:
      case AnswerType.TimeOfDay:
      case AnswerType.Text:
        return answer.content;
      case AnswerType.MultipleChoiceMany:
      case AnswerType.MultipleChoiceSingle:
        const indices = answer.content.split(',').map(parseInt);
        const selectedLabels = question.answerLabels.filter((_l, i) => indices.includes(i)).join(', ');
        return `${answer.content} (${selectedLabels})`;
      case AnswerType.RangeContinuous:
      case AnswerType.RangeDiscrete:
        const leftRightLabels = question.answerLabels.join(' → ');
        return `${answer.content} (${leftRightLabels})`;
      default:
        console.warn('Unexpected answer type: ' + question.answerType);
        return answer.content;
    }
  }

  renderCreationDate(answer: Answer): string {
    return moment(answer.createdLocal).format('YYYY-MM-DD HH:mm');
  }

  userById(id: number): User {
    return this.users.find(u => u.id === id);
  }

  questionById(id: number): Question {
    return this.questions.find(q => q.id === id);
  }
}
