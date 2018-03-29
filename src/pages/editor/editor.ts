import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { QuestionnairesEditorPage } from './questionnaires-editor/questionnaires-editor';
import { QuestionsEditorPage } from './questions-editor/questions-editor';
import { StudiesEditorPage } from './studies-editor/studies-editor';
import { UsersEditorPage } from './users-editor/users-editor';

@IonicPage()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})
export class EditorPage {

  public questionsRoot = QuestionsEditorPage;
  public questionnairesRoot = QuestionnairesEditorPage;
  public studiesRoot = StudiesEditorPage;
  public usersRoot = UsersEditorPage;

  userIsAdmin: boolean;

  constructor(authentication: AuthenticationProvider) {
    this.userIsAdmin = authentication.userIsAdmin();
    authentication.userChange()
      .subscribe(user => this.userIsAdmin = authentication.userIsAdmin(user));
  }
}
