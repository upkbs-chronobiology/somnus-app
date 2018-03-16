import { AuthRestProvider } from '../auth-rest/auth-rest';
import { CacheProvider } from '../cache/cache';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Study } from '../../model/study';

@Injectable()
export class StudiesProvider {

  constructor(private rest: AuthRestProvider, private cache: CacheProvider) {
  }

  listAll(): Observable<Study[]> {
    const fetch = () => this.rest.get('studies').map(s => s as Study[]);
    return this.cache.cached('all studies', fetch);
  }

  create(study: Study): Observable<Study> {
    return this.rest.post('studies', study).map(s => s as Study);
  }

  update(study: Study): Observable<Study> {
    return this.rest.put(`studies/${study.id}`, study).map(s => s as Study);
  }

  delete(studyId: number): Observable<any> {
    return this.rest.delete(`studies/${studyId}`);
  }
}
