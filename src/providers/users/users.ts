import { AuthRestProvider } from '../auth-rest/auth-rest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
}
