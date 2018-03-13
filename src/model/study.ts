export class Study {
  constructor(
    public id: number,
    public name: string
  ) { }

  static clone(study: Study) {
    return new Study(study.id, study.name);
  }
}
