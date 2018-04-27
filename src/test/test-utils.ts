import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AuthRestProvider } from '../providers/auth-rest/auth-rest';
import { Credentials } from '../model/credentials';
import { Observable } from 'rxjs/Observable';
import { TestBed } from '@angular/core/testing';

// expected to be admin
const USER_NAME = 'test-user';
const USER_PW = 'test-user';

export function loginAsTestUser(): Observable<any> {
  const authProvider: AuthenticationProvider = TestBed.get(AuthenticationProvider);
  return authProvider.login(new Credentials(USER_NAME, USER_PW)).map(token => {
    const authRest: AuthRestProvider = TestBed.get(AuthRestProvider);
    authRest.authToken = token;
  });
}
