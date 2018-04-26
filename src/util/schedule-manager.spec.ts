import * as moment from 'moment';
import { Schedule } from '../model/schedule';
import { ScheduleManager } from './schedule-manager';

describe('ScheduleManager', () => {

  it('should handle no schedules', () => {
    const scheduleManager = new ScheduleManager([]);

    expect(scheduleManager.mostRecentDue()).toBeFalsy();
    expect(scheduleManager.nextDue()).toBeFalsy();
  });

  it('should handle empty schedules', () => {
    const emptySchedule = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 0);
    const scheduleManager = new ScheduleManager([emptySchedule]);

    expect(scheduleManager.mostRecentDue()).toBeFalsy();
    expect(scheduleManager.nextDue()).toBeFalsy();
  });

  it('should locate recent and next', () => {
    const schedule = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([schedule]);
    const reference = moment('2000-01-02 16:35:00');

    const mostRecent = scheduleManager.mostRecentDue(reference);
    expect(mostRecent.schedule).toBe(schedule);
    expect(mostRecent.moment.diff(moment('2000-01-02 15:30:00'))).toBe(0);

    const next = scheduleManager.nextDue(reference);
    expect(next.schedule).toBe(schedule);
    expect(next.moment.diff(moment('2000-01-02 17:00:00'))).toBe(0);
  });

  it('should merge multiple schedules', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-02', '2000-01-02', '09:00:00', '21:00:00', 13); // every hour
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);
    const reference = moment('2000-01-02 15:04:12');

    const mostRecent = scheduleManager.mostRecentDue(reference);
    expect(mostRecent.schedule).toBe(scheduleB);
    expect(mostRecent.moment.diff(moment('2000-01-02 15:00:00'))).toBe(0);

    const next = scheduleManager.nextDue(reference);
    expect(next.schedule).toBe(scheduleA);
    expect(next.moment.diff(moment('2000-01-02 15:30:00'))).toBe(0);
  });

  it('should find recent/next across day boundaries', () => {
    const schedule = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([schedule]);
    const reference = moment('2000-01-01 22:55:59');

    const mostRecent = scheduleManager.mostRecentDue(reference);
    expect(mostRecent.schedule).toBe(schedule);
    expect(mostRecent.moment.diff(moment('2000-01-01 21:30:00'))).toBe(0);

    const next = scheduleManager.nextDue(reference);
    expect(next.schedule).toBe(schedule);
    expect(next.moment.diff(moment('2000-01-02 08:00:00'))).toBe(0);
  });

  it('should not report recent/next outside respective boundary', () => {
    const schedule = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([schedule]);

    const referenceBefore = moment('1999-12-25 12:00:00');

    const mostRecentBefore = scheduleManager.mostRecentDue(referenceBefore);
    expect(mostRecentBefore).toBeFalsy();

    const nextBefore = scheduleManager.nextDue(referenceBefore);
    expect(nextBefore.schedule).toBe(schedule);

    const referenceAfter = moment('2000-01-05 12:00:00');

    const mostRecentAfter = scheduleManager.mostRecentDue(referenceAfter);
    expect(mostRecentAfter.schedule).toBe(schedule);
    expect(mostRecentAfter.moment.diff(moment('2000-01-03 21:30:00'))).toBe(0);

    const nextAfter = scheduleManager.nextDue(referenceAfter);
    expect(nextAfter).toBeFalsy();
  });
});
