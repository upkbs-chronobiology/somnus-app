import { CentrizerComponent } from './centrizer/centrizer';
import { ContinuousRangeComponent } from './continuous-range/continuous-range';
import { IonicModule } from 'ionic-angular';
import { LoginComponent } from './login/login';
import { NgModule } from '@angular/core';
import { QuestionEditorComponent } from './question-editor/question-editor';
import { StudyEditorComponent } from './study-editor/study-editor';
import { UserEditorComponent } from './user-editor/user-editor';
import { UserPickerComponent } from './user-picker/user-picker';
import { QuestionnaireEditorComponent } from './questionnaire-editor/questionnaire-editor';
import { ScheduleEditorComponent } from './schedule-editor/schedule-editor';

@NgModule({
  declarations: [LoginComponent,
    CentrizerComponent,
    QuestionEditorComponent,
    ContinuousRangeComponent,
    StudyEditorComponent,
    UserEditorComponent,
    UserPickerComponent,
    QuestionnaireEditorComponent,
    ScheduleEditorComponent],
  imports: [
    IonicModule,
  ],
  exports: [LoginComponent,
    CentrizerComponent,
    QuestionEditorComponent,
    ContinuousRangeComponent,
    StudyEditorComponent,
    UserEditorComponent,
    UserPickerComponent,
    QuestionnaireEditorComponent,
    ScheduleEditorComponent],
  entryComponents: [LoginComponent,
    UserPickerComponent]
})
export class ComponentsModule { }
