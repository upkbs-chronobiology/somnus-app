import { AboutPage } from '../about/about';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { EditorPage } from '../editor/editor';
import { QuestionsPage } from '../questions/questions';

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
