import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Moment } from 'moment';
import { PRIMARY_HEX } from '../../util/theme';

@Injectable()
export class NotificationsProvider {

  private alreadyScheduled = 0;

  constructor(private localNotifications: LocalNotifications) {
  }

  schedule(message: string, time: Moment) {
    this.localNotifications.schedule({
      id: this.alreadyScheduled++, // prevent overriding
      text: message,
      trigger: {
        at: time.toDate()
      },
      color: PRIMARY_HEX,
      led: PRIMARY_HEX,
      smallIcon: 'res://tiny_icon.png'
    });
  }
}
