import moment from 'moment';

export class Answer {
  id: number;
  userId: number;
  created: number; // unix timestamp
  constructor(
    public content: string,
    public questionId: number,
    public createdLocal: string = Answer.localTimestamp() // ISO 8601 with date, time and time zone
  ) {
    if (!moment(createdLocal).isValid())
      throw new Error('Illegal format of createdLocal');
  }

  static localTimestamp(): string {
    return moment().format();
  }
}
