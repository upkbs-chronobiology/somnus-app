import { Credentials, Particulars } from '../../model/credentials';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RestProvider } from '../rest/rest';
import { User } from '../../model/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/empty';

const REGISTER_ENDPOINT = 'auth/signup';
const LOGIN_ENDPOINT = 'auth/login';

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

const RESEARCHER = 'researcher';
const ADMIN = 'admin';

@Injectable()
export class AuthenticationProvider {

  private get currentUser(): User {
    return localStorage.currentUser && JSON.parse(localStorage.currentUser);
  }

  private set currentUser(user: User) {
    localStorage.currentUser = JSON.stringify(user);
  }

  constructor(private rest: RestProvider) {
  }

  public register(particulars: Particulars): Observable<any> {
    return this.rest.post(REGISTER_ENDPOINT, particulars);
  }

  /**
   * Authenticate towards the back end service.
   *
   * @returns Authentication token to be used in subsequent requests
   */
  public login(credentials: Credentials): Observable<string> {
    return this.rest.postResponse(LOGIN_ENDPOINT, credentials, 'json')
      .map((response: HttpResponse<Object>) => {
        this.currentUser = response.body as User;
        return response.headers.get(AUTH_TOKEN_HEADER);
      });
  }

  // XXX: Does this belong here? Or maybe create sth like UserProvider?
  public userCanEdit(): boolean {
    return this.currentUser && [RESEARCHER, ADMIN].some(r => r === this.currentUser.role);
  }
}
