import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

const TOAST_DURATION = 4000;

@Injectable()
export class ToastProvider {

  constructor(private toastController: ToastController) {
  }

  show(message: string, isError: boolean = false): void {
    this.toastController.create({
      message: message,
      duration: TOAST_DURATION,
      cssClass: isError ? 'failure-toast' : 'success-toast'
    }).present();
  }
}
