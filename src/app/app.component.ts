import { Component } from '@angular/core';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { Platform } from '@ionic/angular';
import { PRIMARY_HEX } from '../util/theme';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, headerColor: HeaderColor) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      headerColor.tint(`#${PRIMARY_HEX}`);
    });
  }
}
