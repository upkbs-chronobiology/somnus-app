import { AnswerType } from './answer-type';

export class Question {
  constructor(
    public id: number,
    public content: string,
    public answerType: AnswerType
  ) { }

  static clone(question: Question) {
    return new Question(question.id, question.content, question.answerType);
  }
}
