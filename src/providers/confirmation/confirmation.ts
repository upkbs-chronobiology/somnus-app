import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ConfirmationProvider {

  constructor(private alertController: AlertController) {
  }

  confirm(message: string = 'Are you sure?'): Observable<boolean> {
    const subject = new ReplaySubject<boolean>(1);
    const alert = this.alertController.create({
      title: 'Confirm',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => subject.next(false)
        },
        {
          text: 'Yes, continue',
          handler: () => subject.next(true)
        }
      ]
    });
    alert.present();
    return subject;
  }
}
