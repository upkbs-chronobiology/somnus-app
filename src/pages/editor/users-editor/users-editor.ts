import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { ToastProvider } from '../../../providers/toast/toast';
import { User } from '../../../model/user';
import { UsersProvider } from '../../../providers/users/users';

@Component({
  selector: 'page-users-editor',
  templateUrl: 'users-editor.html',
})
export class UsersEditorPage {

  users: User[];

  constructor(
    private usersProvider: UsersProvider,
    private alertController: AlertController,
    private toast: ToastProvider
  ) {
    usersProvider.listAll().subscribe(users => this.users = users);
  }

  ionViewDidLoad() {
  }

  createUser() {
    this.promptName().subscribe(name => {
      this.usersProvider.create(new User(name, null))
        .catch((err, caught) => {
          this.toast.show(`User creation failed: ${err.message || err}`, true);
          return Observable.empty();
        })
        .subscribe((createdUser: User) => this.users.push(createdUser));
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
}
