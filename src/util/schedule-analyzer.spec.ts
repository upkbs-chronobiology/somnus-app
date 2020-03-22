import { Schedule } from '../model/schedule';
import moment from 'moment';
import { ScheduleAnalyzer, TIME_FORMAT } from './schedule-analyzer';

describe('ScheduleAnalyzer', () => {

  it('should find closest recent moment', () => {
    const schedule = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const analyzer = new ScheduleAnalyzer(schedule);

    const reference = moment('2000-01-02 16:35:00');

    const closest = analyzer.getMostRecent(reference);
    expect(closest.diff(moment('2000-01-02 15:30:00'))).toBe(0);
  });

  it('should find closest future moment', () => {
    const schedule = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:00:00', '21:30:00', 10); // every 1.5 hours
    const analyzer = new ScheduleAnalyzer(schedule);

    const reference = moment('2000-01-02 16:35:00');

    const closest = analyzer.getNext(reference);
    expect(closest.diff(moment('2000-01-02 17:00:00'))).toBe(0);
  });

  it('should be consistent with daily times', () => {
    // second precision to avoid numeric precision errors (happening with millis)
    const timeFormat = 'HH:mm:ss';

    const schedule = new Schedule(0, 0, 0, '2000-01-01', '2000-01-03', '08:12:34', '21:30:01', 77);
    const analyzer = new ScheduleAnalyzer(schedule);

    const reference = moment('2000-01-02 16:35:12');
    const daily = analyzer.getDailyTimes().map(t => t.format(timeFormat));

    const closestNext = analyzer.getNext(reference);
    expect(daily).toContain(closestNext.format(timeFormat));

    const closestRecent = analyzer.getMostRecent(reference);
    expect(daily).toContain(closestRecent.format(timeFormat));
  });
});