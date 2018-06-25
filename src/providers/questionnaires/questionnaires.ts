import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Questionnaire } from '../../model/questionnaire';

@Injectable()
export class QuestionnairesProvider {

  constructor(private rest: AuthRestProvider) {
  }

  listAll(): Observable<Questionnaire[]> {
    return this.rest.get('questionnaires').map(q => q as Questionnaire[]);
  }

  create(questionnaire: Questionnaire): Observable<Questionnaire> {
    return this.rest.post('questionnaires', questionnaire).map(q => q as Questionnaire);
  }

  update(questionnaire: Questionnaire): Observable<Questionnaire> {
    return this.rest.put(`questionnaires/${questionnaire.id}`, questionnaire).map(q => q as Questionnaire);
  }

  delete(id: number): Observable<any> {
    return this.rest.delete(`questionnaires/${id}`);
  }

  duplicate(id: number): Observable<Questionnaire> {
    return this.rest.post(`questionnaires/${id}/duplicate`, null).map(q => q as Questionnaire);
  }
}
