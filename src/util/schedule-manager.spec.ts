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
    const scheduleB = new Schedule(1, 0, 0, '2000-01-02', '2000-01-02', '09:00:00', '21:00:00', 13); // every hour
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

  it('should report recents for each schedule', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '09:00:00', '22:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const mostRecentsLate = scheduleManager.mostRecentsDue(moment('2000-01-01 09:15:00'));
    expect(mostRecentsLate.length).toBe(2);
    expect(mostRecentsLate[0].schedule).toEqual(scheduleB);
    expect(mostRecentsLate[1].schedule).toEqual(scheduleA);
    expect(mostRecentsLate[0].moment.diff('2000-01-01 09:00:00')).toBe(0);
    expect(mostRecentsLate[1].moment.diff('2000-01-01 08:00:00')).toBe(0);

    const mostRecentsEarly = scheduleManager.mostRecentsDue(moment('2000-01-01 08:45:00'));
    expect(mostRecentsEarly.length).toBe(1);
    expect(mostRecentsEarly[0].schedule).toBe(scheduleA);
    expect(mostRecentsEarly[0].moment.diff('2000-01-01 08:00:00')).toBe(0);
  });

  it('should order recents by time', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '20:00:00', 13); // every 1 hour
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:10:00', '20:10:00', 13); // every 1 hour
    const scheduleC = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:05:00', '20:05:00', 13); // every 1 hour
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB, scheduleC]);

    const mostRecentsLate = scheduleManager.mostRecentsDue(moment('2000-01-01 09:15:00'));
    expect(mostRecentsLate.length).toBe(3);
    expect(mostRecentsLate[0].schedule).toEqual(scheduleB);
    expect(mostRecentsLate[1].schedule).toEqual(scheduleC);
    expect(mostRecentsLate[2].schedule).toEqual(scheduleA);
    expect(mostRecentsLate[0].moment.diff('2000-01-01 09:10:00')).toBe(0);
    expect(mostRecentsLate[1].moment.diff('2000-01-01 09:05:00')).toBe(0);
    expect(mostRecentsLate[2].moment.diff('2000-01-01 09:00:00')).toBe(0);
  });

  it('should report future dues', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-04', '09:00:00', '22:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const pivot = moment('2000-01-03 09:45:00');
    const allFutureDues = scheduleManager.allFutureDues(pivot);
    expect(allFutureDues.length).toBe(8 + 9 + 10);
    allFutureDues.forEach(futureDue => expect(futureDue.moment.unix()).toBeGreaterThan(pivot.unix()));
  });

  it('should report n future dues', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-04', '09:00:00', '22:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const pivot = moment('2000-01-03 09:45:00');
    const allFutureDues = scheduleManager.nextNDues(3, pivot);
    expect(allFutureDues.length).toBe(3);
    allFutureDues.forEach(futureDue => expect(futureDue.moment.unix()).toBeGreaterThan(pivot.unix()));
    allFutureDues.forEach(futureDue => expect(futureDue.moment.unix()).toBeLessThan(pivot.add(4, 'hours').unix()));
  });

  it('should yield multiple at the same time for future dues', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '09:00:00', '21:00:00', 13); // every 1 hour
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const pivot = moment('2000-01-02 10:45:00');
    const futureDues = scheduleManager.nextNDues(3, pivot);

    expect(futureDues.length).toBe(3);
    expect(futureDues[0].schedule).toEqual(scheduleA);
    expect(futureDues[0].moment.diff('2000-01-02 11:00:00')).toBe(0);
    expect(futureDues[1].schedule).toEqual(scheduleB);
    expect(futureDues[1].moment.diff('2000-01-02 11:00:00')).toBe(0);
    expect(futureDues[2].schedule).toEqual(scheduleB);
    expect(futureDues[2].moment.diff('2000-01-02 12:00:00')).toBe(0);
  });

  it('should detect unchanged schedule lists', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-04', '09:00:00', '22:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const scheduleASame = Schedule.clone(scheduleA);
    const scheduleBSame = Schedule.clone(scheduleB);

    expect(scheduleManager.containsExactly([scheduleASame, scheduleBSame])).toBeTruthy();
  });

  it('should detect changed schedule lists', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-04', '09:00:00', '22:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const scheduleAChanged = Schedule.clone(scheduleA);
    scheduleAChanged.startDate = '1999-01-01';
    const scheduleBChanged = Schedule.clone(scheduleB);
    scheduleBChanged.frequency = 123;

    expect(scheduleManager.containsExactly([scheduleA, scheduleBChanged])).toBeFalsy();
    expect(scheduleManager.containsExactly([scheduleAChanged, scheduleB])).toBeFalsy();
    expect(scheduleManager.containsExactly([scheduleAChanged, scheduleBChanged])).toBeFalsy();
  });

  it('should list past dues', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '09:00:00', '22:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const pivot = moment('2000-01-02 10:45:00');
    const pastDues = scheduleManager.pastNDues(999, pivot);
    expect(pastDues.length).toBe(2 * 10 + 2 * 2);
    pastDues.forEach(pastDue => expect(pastDue.moment.unix()).toBeLessThan(pivot.unix()));
  });

  it('should order and limit when listing past dues', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '09:00:00', '22:30:00', 10); // every 1.5 hours
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const pivot = moment('2000-01-02 10:45:00');
    const pastDues = scheduleManager.pastNDues(3, pivot);

    expect(pastDues.length).toBe(3);
    expect(pastDues[0].schedule).toBe(scheduleB);
    expect(pastDues[0].moment.diff('2000-01-02 10:30:00')).toBe(0);
    expect(pastDues[1].schedule).toBe(scheduleA);
    expect(pastDues[1].moment.diff('2000-01-02 09:30:00')).toBe(0);
    expect(pastDues[2].schedule).toBe(scheduleB);
    expect(pastDues[2].moment.diff('2000-01-02 09:00:00')).toBe(0);
  });

  it('should yield multiple prompts at the same time when listing past dues', () => {
    const scheduleA = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const scheduleB = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '09:00:00', '21:00:00', 13); // every 1 hour
    const scheduleManager = new ScheduleManager([scheduleA, scheduleB]);

    const pivot = moment('2000-01-02 11:05:00');
    const pastDues = scheduleManager.pastNDues(3, pivot);

    expect(pastDues.length).toBe(3);
    expect(pastDues[0].schedule).toEqual(scheduleA);
    expect(pastDues[0].moment.diff('2000-01-02 11:00:00')).toBe(0);
    expect(pastDues[1].schedule).toEqual(scheduleB);
    expect(pastDues[1].moment.diff('2000-01-02 11:00:00')).toBe(0);
    expect(pastDues[2].schedule).toEqual(scheduleB);
    expect(pastDues[2].moment.diff('2000-01-02 10:00:00')).toBe(0);
  });
});
