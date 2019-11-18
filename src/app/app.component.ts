import { Component } from '@angular/core';
import { HeaderColor } from '@ionic-native/header-color';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import moment from 'moment';
import 'moment-precise-range-plugin';
import { ToastProvider } from '../providers/toast/toast';
import { TabsPage } from '../pages/tabs/tabs';
import { RestProvider } from '../providers/rest/rest';
import { PRIMARY_HEX } from '../util/theme';

const DATE_HEADER = 'Date';
const MAX_TIME_DIFF = 10 * 1000; // [ms]

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, headerColor: HeaderColor,
    private rest: RestProvider, private toast: ToastProvider) {
    const originalNow = Date.now;
    Date.now = () => originalNow();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      headerColor.tint(`#${PRIMARY_HEX}`);

      this.checkTime();
    });
  }

  private checkTime() {
    this.rest.getHeaders('poke').subscribe(headers => {
      if (!headers.has(DATE_HEADER)) {
        console.error(`Poke response had no header ${DATE_HEADER} - could not compare times`);
        return;
      }

      const serverTime = moment(headers.get(DATE_HEADER));
      const now = moment();
      if (Math.abs(serverTime.diff(now)) > MAX_TIME_DIFF) {
        const options = {
          duration: 60 * 1000,
          showCloseButton: true
        };
        this.toast.showCustom(
          `Local device time differs from server (by ${serverTime.preciseDiff(now)}), ` +
          'which can lead to unexpected behavior. Please adjust you clock',
          true, options);
      }
    });
  }
}
