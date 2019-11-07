import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../../model/schedule';

@Injectable()
export class SchedulesProvider {

  constructor(private rest: AuthRestProvider) {
  }

  listMine(): Observable<Schedule[]> {
    return this.rest.get('users/me/schedules')
      .map(s => s as Schedule[]);
  }

  listForQuestionnaire(questionnaireId: number): Observable<Schedule[]> {
    return this.rest.get(`questionnaires/${questionnaireId}/schedules`)
      .map(s => s as Schedule[]);
  }

  create(schedule: Schedule): Observable<Schedule> {
    return this.rest.post('schedules', schedule)
      .map(s => s as Schedule);
  }

  update(schedule: Schedule): Observable<Schedule> {
    return this.rest.put(`schedules/${schedule.id}`, schedule)
      .map(s => s as Schedule);
  }

  delete(id: number): Observable<any> {
    return this.rest.delete(`schedules/${id}`);
  }
}
