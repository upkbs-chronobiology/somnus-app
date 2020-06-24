import * as moment from 'moment';
import { Moment } from 'moment';
import { Schedule } from '../model/schedule';
import { arraysEqual } from './arrays';
import { ScheduleAnalyzer } from './schedule-analyzer';

export class Prompt {
  constructor(public readonly moment: Moment, public readonly schedule: Schedule) { }

  static equal(a: Prompt, b: Prompt): boolean {
    if (!a || !b) return a == b;

    if (a === b) return true;

    return a.moment.isSame(b.moment) &&
      Schedule.equal(a.schedule, b.schedule);
  }
}

function promptComparator(a: Prompt, b: Prompt): number {
  return a.moment.diff(b.moment);
}

export class ScheduleManager {

  private scheduleAnalyzers: ScheduleAnalyzer[];

  constructor(private _schedules: Schedule[]) {
    this.scheduleAnalyzers = _schedules.map(s => new ScheduleAnalyzer(s));
  }

  containsExactly(schedules: Schedule[]): boolean {
    return arraysEqual(this._schedules, schedules, Schedule.equal);
  }

  mostRecentDue(reference: Moment = moment()): Prompt {
    const recents = this.mostRecentsDue(reference).sort(promptComparator);
    if (!recents.length) return null;
    return recents[recents.length - 1];
  }

  /**
   * List the most recently due prompt of each schedule, ordered by moment, descending.
   */
  mostRecentsDue(reference: Moment = moment()): Prompt[] {
    return this.scheduleAnalyzers
      .filter(analyzer => analyzer.getMostRecent(reference))
      .map(analyzer => new Prompt(analyzer.getMostRecent(reference), analyzer.schedule))
      .sort((a, b) => b.moment.diff(a.moment));
  }

  private nextDueFor(reference: Moment, analyzer: ScheduleAnalyzer): Prompt {
    const next = analyzer.getNext(reference);
    return next && new Prompt(next, analyzer.schedule);
  }

  private nextDuesForEach(reference: Moment): Prompt[] {
    return this.scheduleAnalyzers
      .map(analyzer => this.nextDueFor(reference, analyzer))
      .filter(prompt => !!prompt)
      .sort(promptComparator);
  }

  nextDue(reference: Moment = moment()): Prompt {
    const nexts = this.nextDuesForEach(reference);
    return nexts.length ? nexts[0] : null;
  }

  nextNDues(number: number, reference: Moment = moment()): Prompt[] {
    const dues = [];
    let next = this.nextDuesForEach(reference);

    while (number > dues.length && next.length) {
      // take all same-time first ones...
      do
        dues.push(next.shift());
      while (next.length && next[0].moment.isSame(dues[dues.length - 1].moment));

      // ...then refresh (strictly going forward, hence + 1 ms)
      next = this.nextDuesForEach(dues[dues.length - 1].moment.clone().add(1, 'ms'));
    }

    return dues;
  }

  pastNDues(n: number, reference: Moment = moment()): Prompt[] {
    const dues = [];
    let next = this.mostRecentsDue(reference);

    while (n > dues.length && next.length) {
      // take all same-time first ones...
      do
        dues.push(next.shift());
      while (next.length && next[0].moment.isSame(dues[dues.length - 1].moment));

      // ...then refresh (strictly going backward, hence - 1 ms)
      next = this.mostRecentsDue(dues[dues.length - 1].moment.clone().subtract(1, 'ms'));
    }

    return dues;
  }

  allFutureDues(reference: Moment = moment()): Prompt[] {
    const maxTotal = this.scheduleAnalyzers.map(a => a.totalScheduled()).reduce((a, b) => a + b);
    return this.nextNDues(maxTotal, reference);
  }
}
