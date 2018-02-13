import { Injectable } from '@angular/core';
import { Answer } from '../../model/answer';
import { Observable } from 'rxjs/Observable';
import { RestProvider } from '../rest/rest';

@Injectable()
export class AnswersProvider {

  constructor(private rest: RestProvider) {
  }

  sendAll(answers: Answer[]): Observable<Answer[]> {
    return this.rest.post('answers', answers).map(a => a as Answer[]);
  }
}
