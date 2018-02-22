import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../model/question';

@Injectable()
export class QuestionsProvider {

  constructor(private rest: AuthRestProvider) {
  }

  listAll(): Observable<Question[]> {
    return this.rest.get('questions').map(object => object as Question[]);
  }

  create(question: Question): Observable<Question> {
    return this.rest.post('questions', question).map(object => object as Question);
  }

  update(question: Question): Observable<Question> {
    return this.rest.put(`questions/${question.id}`, question).map(object => object as Question);
  }

  delete(id: number): Observable<any> {
    return this.rest.delete(`questions/${id}`);
  }
}
