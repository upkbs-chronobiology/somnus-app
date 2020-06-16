import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PwReset } from '../../model/pw-reset';
import { User } from '../../model/user';
import { AuthRestProvider } from '../auth-rest/auth-rest';
import { CacheProvider } from '../cache/cache';

@Injectable()
export class UsersProvider {

  private readonly listAllObservable: Observable<User[]>;

  constructor(private rest: AuthRestProvider, cacheProvider: CacheProvider) {
    this.listAllObservable = cacheProvider.cachedObservable(() =>
      this.rest.get('users').map(u => u as User[]));
  }

  listAll(): Observable<User[]> {
    return this.listAllObservable.take(1);
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
