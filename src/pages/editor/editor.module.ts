import { ComponentsModule } from '../../components/components.module';
import { EditorPage } from './editor';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { QuestionEditorComponent } from '../../components/question-editor/question-editor';
import { QuestionnaireEditorComponent } from '../../components/questionnaire-editor/questionnaire-editor';
import { QuestionnairesEditorPage } from './questionnaires-editor/questionnaires-editor';
import { QuestionsEditorPage } from './questions-editor/questions-editor';
import { ScheduleEditorComponent } from '../../components/schedule-editor/schedule-editor';
import { SchedulesEditorComponent } from './schedules-editor/schedules-editor';
import { StudiesEditorPage } from './studies-editor/studies-editor';
import { StudyEditorComponent } from '../../components/study-editor/study-editor';
import { UsersEditorPage } from './users-editor/users-editor';


@NgModule({
  declarations: [
    EditorPage,
    QuestionsEditorPage,
    StudiesEditorPage,
    UsersEditorPage,
    QuestionnairesEditorPage,
    SchedulesEditorComponent
  ],
  imports: [
    IonicPageModule.forChild(EditorPage),
    ComponentsModule
  ],
  entryComponents: [
    QuestionsEditorPage,
    StudiesEditorPage,
    UsersEditorPage,
    QuestionEditorComponent,
    StudyEditorComponent,
    QuestionnairesEditorPage,
    QuestionnaireEditorComponent,
    SchedulesEditorComponent,
    ScheduleEditorComponent
  ]
})
export class EditorPageModule { }
