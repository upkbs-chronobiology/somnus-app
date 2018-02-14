import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../model/question';

@Injectable()
export class QuestionsProvider {

  constructor(public rest: AuthRestProvider) {
  }

  listAll(): Observable<Question[]> {
    return this.rest.get('questions').map(object => object as Question[]);
  }
}
