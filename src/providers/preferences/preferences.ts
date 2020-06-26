import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PreferencesProvider {

  private readonly fullWidthLayoutKey = 'fullWidthLayout';

  public get fullWidthLayout(): boolean {
    return window.localStorage.getItem(this.fullWidthLayoutKey) === 'true';
  }
  public set fullWidthLayout(value: boolean) {
    localStorage.setItem(this.fullWidthLayoutKey, `${value}`);

    this.applyFullWidthLayout();
  }

  constructor(public http: HttpClient) {
  }

  applyPreferences() {
    this.applyFullWidthLayout();
  }

  private applyFullWidthLayout() {
    document.body.classList.toggle('limit-width', !this.fullWidthLayout);
  }
}
