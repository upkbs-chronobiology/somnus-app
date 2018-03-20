export class Answer {
  userId: number;
  created: number; // unix timestamp
  constructor(
    public content: string,
    public questionId: number
  ) { }
}
