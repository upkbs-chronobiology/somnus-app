import { Schedule } from 'model/schedule';
import moment, { Duration, Moment } from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm:ss.SSS';

function momentForTime(time: string): Moment {
  return moment(`2000-01-01 ${time}`);
}

function combineDateAndTime(date: Moment, time: Moment): Moment {
  const dateString = date.format(DATE_FORMAT);
  const timeString = time.format(TIME_FORMAT);
  return moment(`${dateString} ${timeString}`);
}

export class ScheduleAnalyzer {

  private get startTimeRef(): Moment {
    return momentForTime(this.schedule.startTime);
  }

  private get endTimeRef(): Moment {
    return momentForTime(this.schedule.endTime);
  }

  private get startDate(): Moment {
    return moment(this.schedule.startDate);
  }

  private get endDate(): Moment {
    return moment(this.schedule.endDate);
  }

  constructor(public schedule: Schedule) {
  }

  private timeInterval(): Duration {
    if (this.schedule.frequency <= 1) return moment.duration(0);

    // XXX: Can we make `end - start` notation work with TS?
    return moment.duration(this.endTimeRef.diff(this.startTimeRef) / (this.schedule.frequency - 1));
  }

  private lastTimeDaily() {
    return this.schedule.frequency > 1 ? this.endTimeRef : this.startTimeRef;
  }

  /**
   * Return most recent time (ignoring date) for a schedule given a reference.
   */
  private getClosestRecentTime(reference: Moment): Moment {
    const referenceTime = momentForTime(reference.format(TIME_FORMAT));

    if (referenceTime < this.startTimeRef) return this.lastTimeDaily();

    const interval = this.timeInterval();
    const n = Math.floor(referenceTime.diff(this.startTimeRef) / interval.asMilliseconds());
    return this.startTimeRef.clone().add(n * interval.asMilliseconds(), 'milliseconds');
  }

  /**
   * Return next time (ignoring date) for a schedule given a reference.
   */
  private getClosestNextTime(reference: Moment): Moment {
    const referenceTime = momentForTime(reference.format(TIME_FORMAT));

    if (referenceTime > this.lastTimeDaily()) return this.startTimeRef;

    const interval = this.timeInterval();
    const n = Math.ceil(referenceTime.diff(this.startTimeRef) / interval.asMilliseconds());
    return this.startTimeRef.clone().add(n * interval.asMilliseconds(), 'milliseconds');
  }

  getMostRecent(reference: Moment): Moment {
    if (this.schedule.frequency <= 0) return null;

    const ultimateEnd = combineDateAndTime(this.endDate, this.lastTimeDaily());
    // last day has already passed
    if (reference > ultimateEnd) return ultimateEnd;

    const ultimateStart = combineDateAndTime(this.startDate, this.startTimeRef);
    // schedule hasn't begun yet
    if (reference < ultimateStart) return null;

    const referenceTime = momentForTime(reference.format(TIME_FORMAT));

    // none scheduled for today yet -> use yesterday's last
    if (referenceTime < this.startTimeRef)
      return combineDateAndTime(reference.clone().subtract(1, 'day'), this.lastTimeDaily());

    return combineDateAndTime(reference, this.getClosestRecentTime(reference));
  }

  getNext(reference: Moment): Moment {
    if (this.schedule.frequency <= 0) return null;

    const ultimateEnd = combineDateAndTime(this.endDate, this.lastTimeDaily());
    // last day has already passed
    if (reference > ultimateEnd) return null;

    const ultimateStart = combineDateAndTime(this.startDate, this.startTimeRef);
    // schedule hasn't begun yet
    if (reference < ultimateStart) return ultimateStart;

    const referenceTime = momentForTime(reference.format(TIME_FORMAT));

    // none scheduled for today anymore -> use tomorrow's first
    if (referenceTime > this.lastTimeDaily())
      return combineDateAndTime(reference.clone().add(1, 'day'), this.startTimeRef);

    return combineDateAndTime(reference, this.getClosestNextTime(reference));
  }

  totalScheduled(): number {
    const days = moment.duration(this.endDate.diff(this.startDate)).days();
    return days * this.schedule.frequency;
  }

  getDailyTimes(): Moment[] {
    if (this.endTimeRef < this.startTimeRef || !this.startTimeRef.isValid() || !this.endTimeRef.isValid()) return [];

    const interval = this.timeInterval();

    const result = [];
    for (let i = 0, time = this.startTimeRef; i < this.schedule.frequency; i++, time = time.clone().add(interval))
      result.push(time);
    return result;
  }
}
