import * as moment from 'moment';
import { Moment } from 'moment';
import { Schedule } from '../model/schedule';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm:ss';

export class Prompt {
  constructor(public readonly moment: Moment, public readonly schedule: Schedule) { }
}

export class ScheduleManager {

  private schedulePrompts: Prompt[][];
  private accumulatedPrompts: Prompt[];

  constructor(schedules: Schedule[]) {
    this.schedulePrompts = schedules.map(s =>
      this.getMoments(s).map(m => new Prompt(m, s))
        .sort((a, b) => a.moment.diff(b.moment))
    );
    this.accumulatedPrompts = this.schedulePrompts.reduce((acc, item) => acc.concat(item), [])
      .sort((a, b) => a.moment.diff(b.moment));
  }

  private getMoments(schedule: Schedule): Moment[] {
    const startDate = moment(schedule.startDate);
    const endDate = moment(schedule.endDate);
    const startTimeRef = moment(`2000-01-01 ${schedule.startTime}`);
    const endTimeRef = moment(`2000-01-01 ${schedule.endTime}`);

    if (endDate < startDate || endTimeRef < startTimeRef) return [];

    // XXX: Can we make `end - start` notation work with TS?
    const interval = moment.duration(endTimeRef.diff(startTimeRef) / (schedule.frequency - 1));

    const result = [];
    for (let date = startDate; date <= endDate; date = date.clone().add(1, 'day'))
      for (let i = 0, time = startTimeRef; i < schedule.frequency; i++ , time = time.clone().add(interval))
        result.push(this.combineDateAndTime(date, time));
    return result;
  }

  private combineDateAndTime(date: Moment, time: Moment): Moment {
    const dateString = date.format(DATE_FORMAT);
    const timeString = time.format(TIME_FORMAT);
    return moment(`${dateString} ${timeString}`);
  }

  mostRecentDue(reference: Moment = moment(), prompts: Prompt[] = this.accumulatedPrompts): Prompt {
    const recents = prompts.filter(p => p.moment <= reference);
    if (!recents.length) return null;
    return recents[recents.length - 1];
  }

  /**
   * List the most recently due prompt of each schedule.
   */
  mostRecentsDue(reference: Moment = moment()): Prompt[] {
    return this.schedulePrompts.map(prompts => this.mostRecentDue(reference, prompts)).filter(p => !!p);
  }

  nextDue(reference: Moment = moment()): Prompt {
    return this.accumulatedPrompts.find(p => p.moment > reference);
  }

  allFutureDues(reference: Moment = moment()): Prompt[] {
    return this.accumulatedPrompts.filter(prompt => prompt.moment.isAfter(reference));
  }
}
