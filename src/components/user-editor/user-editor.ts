import { Component, HostBinding, Input } from '@angular/core';
import { enumAsArray } from '../../util/enums';
import { Observable } from 'rxjs/Observable';
import { Role } from '../../model/role';
import { ToastProvider } from '../../providers/toast/toast';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';

@Component({
  selector: 'user-editor',
  templateUrl: 'user-editor.html'
})
export class UserEditorComponent {

  @HostBinding('class.saving')
  saving: boolean;

  @Input()
  user: User;

  roles: string[] = enumAsArray(Role);

  constructor(private usersProvider: UsersProvider, private toast: ToastProvider) {
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
}
