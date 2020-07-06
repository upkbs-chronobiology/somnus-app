import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { QuestionEditorComponent } from '../../components/question-editor/question-editor';
import { QuestionnaireEditorComponent } from '../../components/questionnaire-editor/questionnaire-editor';
import { ScheduleEditorComponent } from '../../components/schedule-editor/schedule-editor';
import { StudyEditorComponent } from '../../components/study-editor/study-editor';
import { UserEditorComponent } from '../../components/user-editor/user-editor';
import { PipesModule } from '../../pipes/pipes.module';
import { EditorPage } from './editor';
import { OrganizationsEditorPage } from './organizations-editor/organizations-editor';
import { QuestionnairesEditorPage } from './questionnaires-editor/questionnaires-editor';
import { QuestionsEditorPage } from './questions-editor/questions-editor';
import { SchedulesEditorComponent } from './schedules-editor/schedules-editor';
import { StudiesEditorPage } from './studies-editor/studies-editor';
import { UsersEditorPage } from './users-editor/users-editor';


@NgModule({
  declarations: [
    EditorPage,
    QuestionsEditorPage,
    StudiesEditorPage,
    UsersEditorPage,
    QuestionnairesEditorPage,
    SchedulesEditorComponent,
    OrganizationsEditorPage
  ],
  imports: [
    IonicPageModule.forChild(EditorPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    QuestionsEditorPage,
    StudiesEditorPage,
    UsersEditorPage,
    UserEditorComponent,
    QuestionEditorComponent,
    StudyEditorComponent,
    QuestionnairesEditorPage,
    QuestionnaireEditorComponent,
    SchedulesEditorComponent,
    ScheduleEditorComponent,
    OrganizationsEditorPage
  ]
})
export class EditorPageModule { }
