import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from 'ionic-angular';

const TOAST_DURATION = 4000;

@Injectable()
export class ToastProvider {

  constructor(private toastController: ToastController) {
  }

  show(message: string, isError: boolean = false, position: string = 'top'): void {
    this.toastController.create({
      message: message,
      duration: TOAST_DURATION,
      cssClass: isError ? 'failure-toast' : 'success-toast',
      position: position
    }).present();
  }

  showCustom(message: string, isError: boolean = false, customOptions: ToastOptions) {
    const defaultOptions = {
      message: message,
      duration: TOAST_DURATION,
      cssClass: isError ? 'failure-toast' : 'success-toast',
      position: 'top'
    };
    this.toastController.create({ ...defaultOptions, ...customOptions }).present();
  }
}
