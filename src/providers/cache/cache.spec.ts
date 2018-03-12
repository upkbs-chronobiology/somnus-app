import { CacheProvider } from './cache';
import { Observable } from 'rxjs/Observable';

describe('CacheProvider', () => {

  var cacheProvider: CacheProvider;

  beforeEach(() => {
    cacheProvider = new CacheProvider();
  });

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
