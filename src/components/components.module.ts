import { CentrizerComponent } from './centrizer/centrizer';
import { ContinuousRangeComponent } from './continuous-range/continuous-range';
import { IonicModule } from 'ionic-angular';
import { LoginComponent } from './login/login';
import { NgModule } from '@angular/core';
import { QuestionEditorComponent } from './question-editor/question-editor';
import { QuestionnaireEditorComponent } from './questionnaire-editor/questionnaire-editor';
import { QuestionPosingComponent } from './question-posing/question-posing';
import { ResetPasswordComponent } from './reset-password/reset-password';
import { ScheduleEditorComponent } from './schedule-editor/schedule-editor';
import { StudyEditorComponent } from './study-editor/study-editor';
import { UserEditorComponent } from './user-editor/user-editor';
import { UserPickerComponent } from './user-picker/user-picker';
import { AnswersFilterComponent } from './answers-filter/answers-filter';
import { ExpandableItemComponent } from './expandable-item/expandable-item';
import { InputErrorHintComponent } from './input-error-hint/input-error-hint';

@NgModule({
  declarations: [LoginComponent,
    CentrizerComponent,
    QuestionEditorComponent,
    ContinuousRangeComponent,
    StudyEditorComponent,
    UserEditorComponent,
    UserPickerComponent,
    QuestionnaireEditorComponent,
    ScheduleEditorComponent,
    QuestionPosingComponent,
    ResetPasswordComponent,
    AnswersFilterComponent,
    ExpandableItemComponent,
    InputErrorHintComponent],
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
    ScheduleEditorComponent,
    QuestionPosingComponent,
    ResetPasswordComponent,
    AnswersFilterComponent,
    ExpandableItemComponent,
    InputErrorHintComponent],
  entryComponents: [LoginComponent,
    ResetPasswordComponent,
    UserPickerComponent]
})
export class ComponentsModule { }
