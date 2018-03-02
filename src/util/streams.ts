import { Observable, ReplaySubject } from 'rxjs';

/**
 * Make sure the provided observable gets executed, even without an
 * external subscriber.
 * @param observable Task to certainly be executed
 */
export function ensure<T>(observable: Observable<T>): Observable<T> {
  const subject = new ReplaySubject<T>(1);
  observable.subscribe(subject);
  return subject;
}
