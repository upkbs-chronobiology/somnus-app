import { ComponentsModule } from '../../components/components.module';
import { EditorPage } from './editor';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { QuestionsEditorPage } from './questions-editor/questions-editor';
import { StudiesEditorPage } from './studies-editor/studies-editor';
import { StudyEditorComponent } from '../../components/study-editor/study-editor';
import { UsersEditorPage } from './users-editor/users-editor';


@NgModule({
  declarations: [
    EditorPage,
    QuestionsEditorPage,
    StudiesEditorPage,
    UsersEditorPage
  ],
  imports: [
    IonicPageModule.forChild(EditorPage),
    ComponentsModule
  ],
  entryComponents: [
    QuestionsEditorPage,
    StudiesEditorPage,
    UsersEditorPage,
    StudyEditorComponent
  ]
})
export class EditorPageModule { }
