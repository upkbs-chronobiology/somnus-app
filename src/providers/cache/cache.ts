import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const DEFAULT_LIFESPAN = 5000;

class CacheItem<T> {

  public readonly timestamp: number;

  constructor(public readonly object: T, private lifespan: number) {
    this.timestamp = Date.now();
  }

  hasExpired(): boolean {
    return Date.now() > this.timestamp + this.lifespan;
  }
}

@Injectable()
export class CacheProvider {

  private cacheItems = {};
  private runningFactories = {};

  constructor() {
  }

  /**
   * Get a cached version of an object if applicable; use the provided
   * factory otherwise.
   *
   * @param key Unique key for the item to be cached
   * @param factory Function providing a fresh version of the item
   * @param lifespan Caching duration in ms
   */
  cached<T>(key: string, factory: () => Observable<T>, lifespan: number = DEFAULT_LIFESPAN): Observable<T> {
    const item = this.cacheItems[key];
    if (item && !item.hasExpired()) return Observable.of(item.object);

    if (this.runningFactories[key]) return this.runningFactories[key];

    const running = factory().map(object => {
      this.cacheItems[key] = new CacheItem(object, lifespan);
      delete this.runningFactories[key];

      return object;
    });

    this.runningFactories[key] = running;
    return running;
  }
}
