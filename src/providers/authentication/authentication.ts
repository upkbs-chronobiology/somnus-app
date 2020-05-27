import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Credentials, Particulars } from '../../model/credentials';
import { Role, Roles } from '../../model/role';
import { User } from '../../model/user';
import { RestProvider } from '../rest/rest';

const REGISTER_ENDPOINT = 'auth/signup';
const LOGIN_ENDPOINT = 'auth/login';

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

@Injectable()
export class AuthenticationProvider {

  private get currentUser(): User {
    return localStorage.currentUser && JSON.parse(localStorage.currentUser);
  }

  private set currentUser(user: User) {
    localStorage.currentUser = JSON.stringify(user);
    this.userChangeSubject.next(user);
  }

  userChangeSubject = new Subject<User>();

  constructor(
    private rest: RestProvider,
  ) {
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

  public userCanEdit(user: User = this.currentUser): boolean {
    return user && Roles.isEditor(user.role);
  }

  userIsAdmin(user: User = this.currentUser): boolean {
    return user && user.role === Role.Admin;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  userChange(): Observable<User> {
    return this.userChangeSubject;
  }

  forgetUser() {
    this.currentUser = null;
  }

  getUserForToken(token: String): Observable<User> {
    return this.rest.get(`auth/password/reset/${token}/user`).map(u => u as User);
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.rest.post(`auth/password/reset/${token}`, {
      password: password
    });
  }
}
