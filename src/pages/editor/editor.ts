import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
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
  public studiesRoot = StudiesEditorPage;
  public usersRoot = UsersEditorPage;

  constructor() { }
}
