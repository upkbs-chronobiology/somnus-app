import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { NavController } from 'ionic-angular';
import { AuthRestProvider } from '../../providers/auth-rest/auth-rest';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  currentUserName: string;
  appVersion: string;

  constructor(
    public navCtrl: NavController,
    private auth: AuthenticationProvider,
    private authRest: AuthRestProvider,
    appVersion: AppVersion
  ) {
    appVersion.getVersionNumber()
      .then(version => this.appVersion = version)
      .catch(reason => console.warn(`Failed to read version number. Reason: ${reason}`));
  }

  ionViewDidLoad() {
    this.currentUserName = this.auth.getCurrentUser().name;
  }

  logOut() {
    this.authRest.logOut();
  }
}
