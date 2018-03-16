import { Component } from '@angular/core';
import { User } from '../../../model/user';
import { UsersProvider } from '../../../providers/users/users';

@Component({
  selector: 'page-users-editor',
  templateUrl: 'users-editor.html',
})
export class UsersEditorPage {

  users: User[];

  constructor(usersProvider: UsersProvider) {
    usersProvider.listAll().subscribe(users => this.users = users);
  }

  ionViewDidLoad() {
  }

}
