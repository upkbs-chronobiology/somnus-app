import { Component } from '@angular/core';
import { AlertController, ModalController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { UserEditorComponent } from '../../../components/user-editor/user-editor';
import { Role } from '../../../model/role';
import { User } from '../../../model/user';
import { ToastProvider } from '../../../providers/toast/toast';
import { UsersProvider } from '../../../providers/users/users';
import { enumAsArray } from '../../../util/enums';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';

@Component({
  selector: 'page-users-editor',
  templateUrl: 'users-editor.html',
})
export class UsersEditorPage {

  readonly roles = enumAsArray(Role);
  readonly baseUsersRole = 'base user';

  actorIsAdmin: boolean;

  users: User[];
  filterQuery: string;
  roleFilter: string[] = [...this.roles.map(r => r.toString()), this.baseUsersRole];

  constructor(
    private usersProvider: UsersProvider,
    private alertController: AlertController,
    private modal: ModalController,
    private toast: ToastProvider,
    auth: AuthenticationProvider,
  ) {
    this.actorIsAdmin = auth.userIsAdmin();
    this.loadData();
  }

  private static sort(users: User[]): User[] {
    return users.sort((a: User, b: User) => a.name.localeCompare(b.name));
  }

  private loadData() {
    delete this.users;
    this.usersProvider.listAll().subscribe(users => this.users = UsersEditorPage.sort(users));
  }

  ionViewDidLoad() {
  }

  edit(user: User) {
    this.modal.create(UserEditorComponent, {
      user: user
    }).present();
  }

  createUser() {
    this.promptName().subscribe(name => {
      this.usersProvider.create(new User(name, null))
        .catch((err, caught) => {
          this.toast.show(`User creation failed: ${err.message || err}`, true);
          return Observable.empty();
        })
        .subscribe((createdUser: User) => this.users.push(createdUser) && UsersEditorPage.sort(this.users));
    });
  }

  private promptName(): Observable<string> {
    const subject = new Subject<string>();

    this.alertController.create({
      title: 'Username of new user',
      inputs: [{
        name: 'username'
      }],
      buttons: [
        'cancel',
        {
          text: 'Create',
          handler: data => subject.next(data.username)
        }
      ]
    }).present();

    return subject;
  }

  filter(event: any) {
    this.filterQuery = event.target.value;
  }

  filteredUsers(): User[] {
    const queryFiltered = this.filterQuery ?
      this.users.filter(u => u.name.toLowerCase().includes(this.filterQuery.toLowerCase())) :
      this.users;

    if (!this.roleFilter) return queryFiltered;
    const roleFiltered = queryFiltered.filter(u =>
      this.roleFilter.indexOf(u.role && u.role.toString() || this.baseUsersRole) >= 0
    );
    return roleFiltered;
  }
}
