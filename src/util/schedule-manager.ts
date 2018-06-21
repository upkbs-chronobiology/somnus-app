import * as moment from 'moment';
import { getDailyTimes } from './schedules';
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

    if (endDate < startDate) return [];

    const times = getDailyTimes(schedule);

    const result = [];
    for (let date = startDate; date <= endDate; date = date.clone().add(1, 'day'))
      times.forEach(time => result.push(this.combineDateAndTime(date, time)));
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
