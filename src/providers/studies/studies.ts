import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Study } from '../../model/study';
import { CacheProvider } from '../cache/cache';

@Injectable()
export class StudiesProvider {

  constructor(private rest: AuthRestProvider, private cache: CacheProvider) {
  }

  listAll(): Observable<Study[]> {
    const fetch = () => this.rest.get('studies').map(s => s as Study[]);
    return this.cache.cached('all studies', fetch);
  }
}
