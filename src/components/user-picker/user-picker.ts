import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Roles } from '../../model/role';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';

@Component({
  selector: 'user-picker',
  templateUrl: 'user-picker.html'
})
export class UserPickerComponent {

  users: User[];
  filterQuery: string;
  private exclude: User[];
  private editorsOnly: boolean;

  constructor(private view: ViewController, usersProvider: UsersProvider, params: NavParams) {
    this.exclude = params.get('exclude');
    this.editorsOnly = params.get('editorsOnly');

    usersProvider.listAll()
      .map(users => !this.editorsOnly ? users : users.filter(u => Roles.isEditor(u.role)))
      .subscribe(users => this.users = users);
  }

  close() {
    this.view.dismiss();
  }

  pick(user: User) {
    this.view.dismiss(user);
  }

  shouldExclude(user: User): boolean {
    return !!this.exclude.find(u => u.id === user.id);
  }

  filter(event: any) {
    this.filterQuery = event.target.value;
  }

  filteredUsers(): User[] {
    return this.filterQuery ?
      this.users.filter(u => u.name.toLowerCase().includes(this.filterQuery.toLowerCase())) :
      this.users;
  }
}
