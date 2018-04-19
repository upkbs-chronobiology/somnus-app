import { Time } from '@angular/common';

export class Schedule {
  constructor(
    public id: number,
    public questionnaireId: number,
    public userId: number,
    public startDate: Date,
    public endDate: Date,
    public startTime: Time,
    public endTime: Time,
    public frequency: number
  ) { }
}
