export class Questionnaire {
  constructor(
    public id: number,
    public name: string,
    public studyId: number
  ) { }

  static clone(q: Questionnaire): Questionnaire {
    return new Questionnaire(q.id, q.name, q.studyId);
  }
}
