import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Study } from '../../model/study';

@Injectable()
export class StudiesProvider {

  constructor(private rest: AuthRestProvider) {
  }

  listAll(): Observable<Study[]> {
    // TODO: Cache?
    return this.rest.get('studies').map(s => s as Study[]);
  }
}
