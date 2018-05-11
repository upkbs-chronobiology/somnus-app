import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PwReset } from '../../model/pw-reset';
import { User } from '../../model/user';

@Injectable()
export class UsersProvider {

  constructor(private rest: AuthRestProvider) {
  }

  listAll(): Observable<User[]> {
    return this.rest.get('users').map(u => u as User[]);
  }

  update(user: User): Observable<any> {
    return this.rest.put(`users/${user.id}`, user);
  }

  create(user: User): Observable<User> {
    return this.rest.post('users', user).map(u => u as User);
  }

  generatePwResetToken(user: User): Observable<PwReset> {
    return this.rest.get(`auth/password/reset/new/${user.id}`).map(r => r as PwReset);
  }
}
