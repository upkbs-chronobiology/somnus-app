import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Answer } from '../../model/answer';
import { AuthRestProvider } from '../auth-rest/auth-rest';

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

  listByQuestionnaire(questionnaireId: number): Observable<Answer[]> {
    return this.rest.get(`questionnaires/${questionnaireId}/answers`).map(a => a as Answer[]);
  }

  listMineByQuestionnaire(questionnaireId: number): Observable<Answer[]> {
    return this.rest.get(`questionnaires/${questionnaireId}/answers/mine`).map(a => a as Answer[]);
  }

  delete(answerId: number): Observable<any> {
    return this.rest.delete(`answers/${answerId}`);
  }
}
