import { Component } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { Answer } from '../../../model/answer';
import { AnswerType } from '../../../model/answer-type';
import { Question } from '../../../model/question';
import { User } from '../../../model/user';
import { QuestionsProvider } from '../../../providers/questions/questions';
import { UsersProvider } from '../../../providers/users/users';

@Component({
  selector: 'page-answers',
  templateUrl: 'answers.html',
})
export class AnswersPage {

  private users: User[];
  private questions: Question[];

  answers: Map<number, Answer[]>;
  questionIdsInScope: number[];

  constructor(
    usersProvider: UsersProvider,
    questionsProvider: QuestionsProvider
  ) {
    Observable.combineLatest(
      usersProvider.listAll(),
      questionsProvider.listAll()
    ).subscribe(([users, questions]) => {
      this.users = users;
      this.questions = questions;
    });
  }

  onAnswersChange(answers: Map<number, Answer[]>) {
    this.answers = answers;

    // This is to avoid "expression changed" errors
    this.questionIdsInScope = Array.from(this.answers.keys());
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
