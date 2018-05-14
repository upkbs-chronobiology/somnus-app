import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { Credentials } from '../../model/credentials';
import { ModalController, ViewController } from 'ionic-angular';
import { ResetPasswordComponent } from '../reset-password/reset-password';
import { ToastProvider } from '../../providers/toast/toast';

export const PW_MIN_LENGTH = 8;

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {

  readonly PW_MIN_LENGTH = PW_MIN_LENGTH;

  public registration = false;
  public readonly credentials = new Credentials('', '');

  constructor(
    private authentication: AuthenticationProvider,
    private view: ViewController,
    private toast: ToastProvider,
    private modal: ModalController,
  ) {
  }

  public submit() {
    if (this.registration) this.register();
    else this.login();
  }

  private register() {
    // currently works because particulars have the same form as credentials
    this.authentication.register(this.credentials).subscribe(() => {
      this.showToast('Registration successful', true);
      this.registration = false;
    },
      error => this.showToast('Registration failed', false));
  }

  private login() {
    this.authentication.login(this.credentials).subscribe((token: string) => {
      this.showToast('Login successful', true);
      this.view.dismiss(token);
    },
      error => this.showToast('Login failed', false));
  }

  private showToast(message: string, success: boolean) {
    this.toast.show(message, !success);
  }

  resetPassword() {
    this.modal.create(ResetPasswordComponent).present();
  }
}
