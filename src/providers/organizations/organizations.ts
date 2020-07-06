import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from '../../model/organization';
import { AuthRestProvider } from '../auth-rest/auth-rest';

@Injectable()
export class OrganizationsProvider {

  constructor(public rest: AuthRestProvider) { }

  listAll(): Observable<Organization[]> {
    return this.rest.get('organizations')
      .map(o => o as Organization[]);
  }

  create(organization: Organization) {
    return this.rest.post('organizations', organization)
      .map(o => o as Organization);
  }
  update(organization: Organization) {
    return this.rest.put(`organizations/${organization.id}`, organization)
      .map(o => o as Organization);
  }
}
