import { Answer } from '../../model/answer';
import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AnswersProvider {

  constructor(private rest: AuthRestProvider) {
  }

  sendAll(answers: Answer[]): Observable<Answer[]> {
    return this.rest.post('answers', answers).map(a => a as Answer[]);
  }

  listAll(): Observable<Answer[]> {
    return this.rest.get('answers').map(a => a as Answer[]);
  }
}
