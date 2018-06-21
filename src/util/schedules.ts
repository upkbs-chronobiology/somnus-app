import moment from 'moment';
import { Moment } from 'moment';
import { Schedule } from 'model/schedule';

export function getDailyTimes(schedule: Schedule): Moment[] {
  const startTimeRef = moment(`2000-01-01 ${schedule.startTime}`);
  const endTimeRef = moment(`2000-01-01 ${schedule.endTime}`);

  if (endTimeRef < startTimeRef || !startTimeRef.isValid() || !endTimeRef.isValid()) return [];

  // XXX: Can we make `end - start` notation work with TS?
  const interval = moment.duration(endTimeRef.diff(startTimeRef) / (schedule.frequency - 1));

  const result = [];
  for (let i = 0, time = startTimeRef; i < schedule.frequency; i++ , time = time.clone().add(interval))
    result.push(time);
  return result;
}
