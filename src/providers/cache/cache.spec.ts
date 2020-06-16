import { Observable } from 'rxjs/Observable';
import { CacheProvider } from './cache';

describe('CacheProvider', () => {

  var cacheProvider: CacheProvider;

  beforeEach(() => {
    cacheProvider = new CacheProvider();
  });

  describe('cached', () => {
    it('should execute factory on first call', done => {
      cacheProvider.cached('foo 1', () => {
        done();
        return Observable.empty();
      });
    });

    it('should not execute factory on immediate second call', done => {
      cacheProvider.cached('foo 2', () => {
        return Observable.of('test A');
      }).subscribe();

      cacheProvider.cached('foo 2', () => {
        fail();
        return Observable.of('test B');
      }).subscribe(item => {
        expect(item).toBe('test A');
        done();
      });
    });

    it('should execute factory after cache expiration', done => {
      cacheProvider.cached('foo 3', () => {
        return Observable.of('test A');
      }, 1).subscribe();

      setTimeout(() => {
        cacheProvider.cached('foo 3', () => {
          return Observable.of('test B');
        }).subscribe(item => {
          expect(item).toBe('test B');
          done();
        });
      }, 5);
    });
  });

  describe('cachedObservable', () => {
    it('should execute factory on first call', done => {
      cacheProvider.cachedObservable(() => {
        done();
        return Observable.empty();
      }).take(1).subscribe();
    });

    it('should not execute factory on immediate second call', done => {
      let count = 1;
      const observable = cacheProvider.cachedObservable(() => {
        return Observable.of(count++);
      });

      let seen = 0;
      observable.take(1).subscribe(c => {
        seen++;
        expect(c).toBe(1);
      });
      observable.take(1).subscribe(c => {
        seen++;
        expect(c).toBe(1);
        expect(seen).toBe(2);
        done();
      });
    });

    it('should execute factory after cache expiration', done => {
      let count = 1;
      const observable = cacheProvider.cachedObservable(() => {
        return Observable.of(count++);
      }, 1);

      let seen = 0;
      observable.take(1).subscribe(c => {
        seen++;
        expect(c).toBe(1);
      });

      setTimeout(() => {
        observable.take(1).subscribe(c => {
          seen++;
          expect(c).toBe(2);
          expect(seen).toBe(2);
          done();
        });
      }, 5);
    });
  });
});
