import { Injectable, Injector } from '@angular/core';
import { Credentials, Particulars } from '../../model/credentials';
import { RestProvider } from '../rest/rest';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/empty';
import { HttpResponse } from '@angular/common/http';

const REGISTER_ENDPOINT = 'auth/signup';
const LOGIN_ENDPOINT = 'auth/login';

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

@Injectable()
export class AuthenticationProvider {

  constructor(private injector: Injector) { // FIXME: injection hack
  }

  public register(particulars: Particulars): Observable<void> {
    const rest = this.injector.get(RestProvider);
    return rest.post(REGISTER_ENDPOINT, particulars).map(() => { });
  }

  public login(credentials: Credentials): Observable<void> {
    const rest = this.injector.get(RestProvider);
    return rest.postResponse(LOGIN_ENDPOINT, credentials, false)
      .map((response: HttpResponse<Object>) => {
        rest.setAuthToken(response.headers.get(AUTH_TOKEN_HEADER));
      });
  }
}
