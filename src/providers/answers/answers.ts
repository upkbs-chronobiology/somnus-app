import { Injectable } from '@angular/core';
import { Answer } from '../../model/answer';
import { Observable } from 'rxjs/Observable';
import { AuthRestProvider } from '../auth-rest/auth-rest';

@Injectable()
export class AnswersProvider {

  constructor(private rest: AuthRestProvider) {
  }

  sendAll(answers: Answer[]): Observable<Answer[]> {
    return this.rest.post('answers', answers).map(a => a as Answer[]);
  }
}
