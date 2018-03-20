import { AboutPage } from '../about/about';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { DataPage } from '../data/data';
import { EditorPage } from '../editor/editor';
import { QuestionsPage } from '../questions/questions';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = QuestionsPage;
  tab2Root = AboutPage;
  tab3Root = EditorPage;
  tab4Root = DataPage;

  userCanEdit: boolean;

  constructor(private authentication: AuthenticationProvider) {
    this.userCanEdit = this.authentication.userCanEdit();
    this.authentication.userChange().subscribe(newUser => {
      this.userCanEdit = this.authentication.userCanEdit(newUser);
    });
  }
}
