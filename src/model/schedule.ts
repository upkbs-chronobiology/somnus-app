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
}
