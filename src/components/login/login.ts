import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { Credentials } from '../../model/credentials';
import { ToastController, ViewController } from 'ionic-angular';

const TOAST_DURATION = 4000;

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {

  public registration = false;
  public readonly credentials = new Credentials('', '');

  constructor(
    private authentication: AuthenticationProvider,
    private view: ViewController,
    private toast: ToastController,
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
    this.toast.create({
      message: message,
      duration: TOAST_DURATION,
      cssClass: success ? 'success-toast' : 'failure-toast'
    }).present();
  }
}
