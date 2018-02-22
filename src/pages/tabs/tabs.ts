import { AboutPage } from '../about/about';
import { Component } from '@angular/core';
import { QuestionsPage } from '../questions/questions';
import { EditorPage } from '../editor/editor';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = QuestionsPage;
  tab2Root = AboutPage;
  tab3Root = EditorPage;

  constructor(private authentication: AuthenticationProvider) {
  }

  userCanEdit(): boolean {
    return this.authentication.userCanEdit();
  }
}
