// import * as moment from 'moment';
import moment from 'moment';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component, HostBinding } from '@angular/core';
import { enumAsArray } from '../../util/enums';
import { NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { PwReset } from '../../model/pw-reset';
import { Role } from '../../model/role';
import { ToastProvider } from '../../providers/toast/toast';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';

@Component({
  selector: 'user-editor',
  templateUrl: 'user-editor.html'
})
export class UserEditorComponent {

  currentUserIsAdmin: boolean;
  userIsEditor: boolean;

  @HostBinding('class.saving')
  saving: boolean;

  user: User;
  pwReset: PwReset;
  loadingReset: boolean;

  roles: string[] = enumAsArray(Role);

  constructor(
    private usersProvider: UsersProvider,
    private toast: ToastProvider,
    auth: AuthenticationProvider,
    private view: ViewController,
    params: NavParams,
  ) {
    this.currentUserIsAdmin = auth.userIsAdmin();
    this.user = params.data.user;
    this.userIsEditor = auth.userCanEdit(this.user);
  }

  onChange() {
    this.saving = true;
    this.usersProvider.update(this.user)
      .catch((error, caught) => {
        this.toast.show(`Failed to update user "${this.user.name}": ${error.message || error}`, true);
        return Observable.throw(caught);
      }).subscribe(() => {
        this.saving = false;
      });
  }

  generatePwResetToken() {
    this.loadingReset = true;
    this.usersProvider.generatePwResetToken(this.user).subscribe(pwReset => {
      this.loadingReset = false;
      this.pwReset = pwReset;
    });
  }

  close() {
    this.view.dismiss();
  }

  fromNow(timestamp: number): string {
    return moment(timestamp).fromNow();
  }
}
