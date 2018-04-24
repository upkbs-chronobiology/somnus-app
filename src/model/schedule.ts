export class Schedule {
  constructor(
    public id: number,
    public questionnaireId: number,
    public userId: number,
    public startDate: string,
    public endDate: string,
    public startTime: string,
    public endTime: string,
    public frequency: number
  ) { }

  static clone(s: Schedule): Schedule {
    return new Schedule(s.id, s.questionnaireId, s.userId,
      s.startDate, s.endDate, s.startTime, s.endTime, s.frequency);
  }

  static equal(a: Schedule, b: Schedule): boolean {
    return a.id === b.id && a.questionnaireId === b.questionnaireId && a.userId === b.userId &&
      a.startDate === b.startDate && a.endDate === b.endDate &&
      a.startTime === b.startTime && a.endTime === b.endTime && a.frequency === b.frequency;
  }
}
