import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RestProvider } from '../rest/rest';
import { Question } from '../../model/question';

@Injectable()
export class QuestionsProvider {

  constructor(public rest: RestProvider) {
  }

  listAll(): Observable<Question[]> {
    return this.rest.get('questions').map(object => object as Question[]);
  }
}
