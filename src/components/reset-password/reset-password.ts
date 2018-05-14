import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { PW_MIN_LENGTH } from '../login/login';
import { ToastProvider } from '../../providers/toast/toast';
import { User } from '../../model/user';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordComponent {

  readonly PW_MIN_LENGTH = PW_MIN_LENGTH;

  token: string;
  user: User;
  loadingUser: boolean;

  tokenError: string;

  password: string;
  submitting: boolean;
  resetSuccess: boolean;

  constructor(
    private auth: AuthenticationProvider,
    private view: ViewController,
    private toast: ToastProvider
  ) {
  }

  checkToken() {
    delete this.tokenError;
    this.loadingUser = true;

    this.auth.getUserForToken(this.token)
      .finally(() => this.loadingUser = false)
      .subscribe(user => {
        this.user = user;
      }, err => this.tokenError = 'Token is not valid');
  }

  resetPassword() {
    this.submitting = true;
    this.auth.resetPassword(this.token, this.password).subscribe(() => {
      this.submitting = false;
      this.resetSuccess = true;
    }, error => this.toast.show(`Something went wrong: ${error && error.message}`, true));
  }

  close() {
    this.view.dismiss();
  }
}
