import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Moment } from 'moment';
import { Platform } from '@ionic/angular';
import { PRIMARY_HEX } from '../../util/theme';

@Injectable()
export class NotificationsProvider {

  private alreadyScheduled = 0;

  constructor(private localNotifications: LocalNotifications, private platform: Platform) {
  }

  /**
   * Cancel all (already shown as well as scheduled) notifications.
   */
  cancelAll(): Promise<any> {
    if (!this.platform.is('cordova')) return new Promise(() => { });

    return this.localNotifications.cancelAll();
  }

  /**
   * Clear already shown notifications.
   */
  clearAll(): Promise<any> {
    if (!this.platform.is('cordova')) return new Promise(() => { });

    return this.localNotifications.clearAll();
  }

  schedule(items: { message: string, time: Moment }[]) {
    if (!this.platform.is('cordova')) return;

    const schedules: any[] = items.map(item => ({
      id: this.alreadyScheduled++,
      text: item.message,
      trigger: {
        at: item.time.toDate()
      },
      color: PRIMARY_HEX,
      led: PRIMARY_HEX,
      smallIcon: 'res://tiny_icon.png'
    }));
    this.localNotifications.schedule(schedules);
  }
}
