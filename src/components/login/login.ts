import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component, OnInit } from '@angular/core';
import { Credentials } from '../../model/credentials';
import { ModalController, ViewController, Platform } from 'ionic-angular';
import { ResetPasswordComponent } from '../reset-password/reset-password';
import { ToastProvider } from '../../providers/toast/toast';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id';

export const PW_MIN_LENGTH = 8;
const CREDENTIALS_KEY = 'credentials';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent implements OnInit {

  readonly PW_MIN_LENGTH = PW_MIN_LENGTH;

  public registration = false;
  public readonly credentials = new Credentials('', '');
  public pwConfirmation: string;

  submitting: boolean;

  showLostPwHint: boolean;

  biometricAvailable: string;
  saveBiometrics: boolean = true;

  constructor(
    private authentication: AuthenticationProvider,
    private view: ViewController,
    private toast: ToastProvider,
    private modal: ModalController,
    private bioAuth: KeychainTouchId,
    private platform: Platform,
  ) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.bioAuth.isAvailable().then(result => {
        this.biometricAvailable = result;
      }).catch(error =>
        console.info('Biometric login not avilable: ', error));
    });
  }

  public submit() {
    if (this.registration) this.register();
    else this.login().then(() => {
      if (this.biometricAvailable && this.saveBiometrics)
        this.storeBiometrics();
    });
  }

  private register() {
    this.submitting = true;
    // currently works because particulars have the same form as credentials
    this.authentication.register(this.credentials)
      .finally(() => this.submitting = false)
      .subscribe(() => {
        this.showToast('Registration successful', true);
        this.registration = false;
      },
        error => this.showToast('Registration failed', false));
  }

  private login(): Promise<any> {
    this.submitting = true;
    return new Promise((resolve, reject) => {
      this.authentication.login(this.credentials)
        .finally(() => this.submitting = false)
        .subscribe((token: string) => {
          this.showToast('Login successful', true);
          resolve(token);
          this.view.dismiss(token);
        },
          error => this.showToast('Login failed', false));
    });
  }

  private storeBiometrics() {
    this.bioAuth.save(CREDENTIALS_KEY, this.credentials.combine())
      .then(() => {
        localStorage.bioCredentials = true;
      }).catch(err => {
        // FIXME: iPhone X reports error, but still saves, so we claim success anyway.
        // https://github.com/sjhoeksma/cordova-plugin-keychain-touch-id/issues/61
        localStorage.bioCredentials = true;

        console.warn('Error saving credentials: ' + err);
      });
  }

  canLoginBiometric(): boolean {
    return this.biometricAvailable && localStorage.bioCredentials;
  }

  loginBiometric() {
    this.bioAuth.verify(CREDENTIALS_KEY, 'Biometric login').then(combinedCredentials => {
      const bioCredentials = Credentials.fromCombined(combinedCredentials);
      this.credentials.name = bioCredentials.name;
      this.credentials.password = bioCredentials.password;
      this.login();
    }).catch(err => {
      this.showToast('Biometric authentication failed', false);
      console.error('Biometric authentication failed', err);
    });
  }

  private showToast(message: string, success: boolean) {
    this.toast.show(message, !success);
  }

  resetPassword() {
    this.modal.create(ResetPasswordComponent).present();
  }

  passwordsMatch(): boolean {
    return this.credentials.password === this.pwConfirmation;
  }
}
