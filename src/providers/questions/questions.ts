import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../model/question';
import { AuthRestProvider } from '../auth-rest/auth-rest';
import { CacheProvider } from '../cache/cache';

@Injectable()
export class QuestionsProvider {

  private readonly listAllObservable: Observable<Question[]>;

  constructor(private rest: AuthRestProvider, cacheProvider: CacheProvider) {
    this.listAllObservable = cacheProvider.cachedObservable(() =>
      rest.get('questions').map(object => object as Question[]));
  }

  listAll(): Observable<Question[]> {
    return this.listAllObservable.take(1);
  }

  listByQuestionnaire(questionnaireId: number): Observable<Question[]> {
    return this.rest.get(`questionnaires/${questionnaireId}/questions`).map(q => q as Question[]);
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
