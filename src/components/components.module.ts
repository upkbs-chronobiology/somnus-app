import { CentrizerComponent } from './centrizer/centrizer';
import { IonicModule } from 'ionic-angular';
import { LoginComponent } from './login/login';
import { NgModule } from '@angular/core';
import { QuestionEditorComponent } from './question-editor/question-editor';
import { ContinuousRangeComponent } from './continuous-range/continuous-range';
import { StudyEditorComponent } from './study-editor/study-editor';
import { UserEditorComponent } from './user-editor/user-editor';

@NgModule({
  declarations: [LoginComponent,
    CentrizerComponent,
    QuestionEditorComponent,
    ContinuousRangeComponent,
    StudyEditorComponent,
    UserEditorComponent],
  imports: [
    IonicModule,
  ],
  exports: [LoginComponent,
    CentrizerComponent,
    QuestionEditorComponent,
    ContinuousRangeComponent,
    StudyEditorComponent,
    UserEditorComponent],
  entryComponents: [LoginComponent]
})
export class ComponentsModule { }
