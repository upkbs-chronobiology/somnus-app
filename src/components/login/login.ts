import { Component } from '@angular/core';
import { Credentials } from '../../model/credentials';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Observable } from 'rxjs/Observable';
import { ViewController, ToastController } from 'ionic-angular';

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
    // currently works because particulars have the same form as credentials
    const action: (credentials: Credentials) => Observable<void> =
      this.registration ? this.authentication.register : this.authentication.login;

    action.call(this.authentication, this.credentials).subscribe(
      () => {
        this.showToast(this.registration ? 'Registration successful' : 'Login successful', true);

        if (!this.registration)
          this.view.dismiss();
        else
          this.registration = false;
      },
      error => this.showToast(this.registration ? 'Registration failed' : 'Login failed', false)
    );
  }

  private showToast(message: string, success: boolean) {
    this.toast.create({
      message: message,
      duration: TOAST_DURATION,
      cssClass: success ? 'success-toast' : 'failure-toast'
    }).present();
  }
}
