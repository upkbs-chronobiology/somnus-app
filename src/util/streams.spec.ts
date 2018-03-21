import { ensure } from './streams';
import { Observable } from 'rxjs/Observable';

describe('ensure', () => {
  it('should execute an observable without external subscriber', done => {
    let canary = false;

    const observable = Observable.create(observer => {
      canary = true;
      observer.next();
    });

    expect(canary).toBe(false);

    ensure(observable.map(() => {
      expect(canary).toBe(true);
      done();
    }));
  });
});
