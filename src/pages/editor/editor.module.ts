import { ComponentsModule } from '../../components/components.module';
import { EditorPage } from './editor';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

// XXX: Is the existence of a separate module for this page justified?
@NgModule({
  declarations: [
    EditorPage,
  ],
  imports: [
    IonicPageModule.forChild(EditorPage),
    ComponentsModule
  ],
})
export class EditorPageModule {}
