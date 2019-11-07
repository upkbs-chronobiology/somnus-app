import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DataProvider {

  constructor(private rest: AuthRestProvider) {
  }

  fetch(studyId: number): Observable<Blob> {
    return this.rest.getBlob(`data/studies/${studyId}/csv/zip`);
  }
}
