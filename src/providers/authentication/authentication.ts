import { Injectable } from '@angular/core';
import { Credentials, Particulars } from '../../model/credentials';
import { RestProvider } from '../rest/rest';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/empty';

const REGISTER_ENDPOINT = 'auth/signup';
const LOGIN_ENDPOINT = 'auth/login';

export const AUTH_TOKEN_HEADER = 'X-Auth-Token';

@Injectable()
export class AuthenticationProvider {

  constructor(public rest: RestProvider) {
  }

  public register(particulars: Particulars): Observable<void> {
    return this.rest.post(REGISTER_ENDPOINT, particulars)
      .concatMap((response: Response) => {
        if (response.ok)
          return Observable.empty();
        else
          return Observable.throw(new Error('Registration failed'));
      });
  }

  public login(credentials: Credentials): Observable<void> {
    return this.rest.post(LOGIN_ENDPOINT, credentials)
      .map((response: Response) => {
        this.rest.setAuthToken(response.headers.get(AUTH_TOKEN_HEADER));
      });
  }
}
