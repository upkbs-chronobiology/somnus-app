import { AuthRestProvider } from '../auth-rest/auth-rest';
import { CacheProvider } from '../cache/cache';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Study } from '../../model/study';
import { User } from '../../model/user';
import { StudyAccess } from 'model/study-access';

@Injectable()
export class StudiesProvider {

  constructor(private rest: AuthRestProvider, private cache: CacheProvider) {
  }

  listAll(): Observable<Study[]> {
    const fetch = () => this.rest.get('studies').map(s => s as Study[]);
    return this.cache.cached('all studies', fetch);
  }

  create(study: Study): Observable<Study> {
    return this.rest.post('studies', study).map(s => s as Study);
  }

  update(study: Study): Observable<Study> {
    return this.rest.put(`studies/${study.id}`, study).map(s => s as Study);
  }

  delete(studyId: number): Observable<any> {
    return this.rest.delete(`studies/${studyId}`);
  }

  listParticipants(studyId: number): Observable<User[]> {
    return this.rest.get(`studies/${studyId}/participants`).map(u => u as User[]);
  }

  addParticipant(studyId: number, userId: number): Observable<any> {
    return this.rest.put(`studies/${studyId}/participants/${userId}`, null);
  }

  removeParticipant(studyId: number, userId: number): Observable<any> {
    return this.rest.delete(`studies/${studyId}/participants/${userId}`);
  }

  listAcls(studyId: number): Observable<StudyAccess[]> {
    return this.rest.get(`studies/${studyId}/acls`).map(sa => sa as StudyAccess[]);
  }

  updateAccess(studyAccess: StudyAccess): Observable<any> {
    return this.rest.put(`studies/${studyAccess.studyId}/acls/${studyAccess.userId}`, studyAccess);
  }

  removeAccess(studyAccess: StudyAccess): Observable<any> {
    return this.rest.delete(`studies/${studyAccess.studyId}/acls/${studyAccess.userId}`);
  }
}
