import { AnswerType } from './answer-type';
import { InclusiveRange } from './inclusive-range';

export class Question {
  constructor(
    public id: number,
    public content: string,
    public answerType: AnswerType,
    public answerLabels: String[],
    public answerRange: InclusiveRange,
    public questionnaireId: number
  ) { }

  static clone(q: Question): Question {
    return new Question(q.id, q.content, q.answerType, q.answerLabels, InclusiveRange.clone(q.answerRange), q.questionnaireId);
  }
}
