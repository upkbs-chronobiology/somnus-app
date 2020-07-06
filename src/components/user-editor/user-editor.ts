import { Component, HostBinding } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Organization } from '../../model/organization';
import { PwReset } from '../../model/pw-reset';
import { Role } from '../../model/role';
import { User } from '../../model/user';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { OrganizationsProvider } from '../../providers/organizations/organizations';
import { ToastProvider } from '../../providers/toast/toast';
import { UsersProvider } from '../../providers/users/users';
import { enumAsArray } from '../../util/enums';

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
  organizations: Organization[];

  constructor(
    private usersProvider: UsersProvider,
    private toast: ToastProvider,
    auth: AuthenticationProvider,
    private view: ViewController,
    params: NavParams,
    organizationsProvider: OrganizationsProvider,
  ) {
    this.currentUserIsAdmin = auth.userIsAdmin();
    this.user = params.data.user;
    this.userIsEditor = auth.userCanEdit(this.user);

    if (this.currentUserIsAdmin)
      organizationsProvider.listAll()
        .subscribe(os => this.organizations = os);
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
