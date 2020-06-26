import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { AppVersion } from '@ionic-native/app-version';
import { NavController } from 'ionic-angular';
import { PW_MIN_LENGTH } from '../../components/login/login';
import { AuthRestProvider } from '../../providers/auth-rest/auth-rest';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit {

  readonly PW_MIN_LENGTH = PW_MIN_LENGTH;

  currentUserName: string;
  appVersion: string;

  @ViewChild('pwChangeForm')
  pwChangeForm: NgForm;

  oldPassword: string;
  newPassword: string;
  newPwConfirmation: string;

  constructor(
    public navCtrl: NavController,
    private auth: AuthenticationProvider,
    private authRest: AuthRestProvider,
    appVersion: AppVersion,
    public preferences: PreferencesProvider,
    public formBuilder: FormBuilder,
    private toastProvider: ToastProvider
  ) {
    appVersion.getVersionNumber()
      .then(version => this.appVersion = version)
      .catch(reason => console.warn(`Failed to read version number. Reason: ${reason}`));

  }

  ngOnInit() {
    this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(PW_MIN_LENGTH)])],
      newPwConfirmation: ['', Validators.compose([Validators.required, Validators.minLength(PW_MIN_LENGTH)])]
    });
  }

  ionViewDidLoad() {
    this.currentUserName = this.auth.getCurrentUser().name;
  }

  logOut() {
    this.authRest.logOut();
  }

  changePassword() {
    this.authRest.changePassword(this.pwChangeForm.value)
      .subscribe(
        _success => {
          this.toastProvider.show('Password successfully changed');
          this.pwChangeForm.reset();
        },
        (err: HttpErrorResponse) => this.toastProvider.show(`Failed to change password: ${err.message}`, true)
      );
  }
}
