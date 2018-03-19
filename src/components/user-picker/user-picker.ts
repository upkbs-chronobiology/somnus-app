import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';

@Component({
  selector: 'user-picker',
  templateUrl: 'user-picker.html'
})
export class UserPickerComponent {

  users: User[];
  private exclude: User[];

  constructor(private view: ViewController, usersProvider: UsersProvider, params: NavParams) {
    usersProvider.listAll().subscribe(users => this.users = users);
    this.exclude = params.get('exclude');
  }

  pick(user: User) {
    this.view.dismiss(user);
  }

  shouldExclude(user: User): boolean {
    return !!this.exclude.find(u => u.id === user.id);
  }
}
