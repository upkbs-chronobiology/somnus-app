import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AnswersPage } from './answers/answers';
import { DataPage } from './data';
import { ExportPage } from './export/export';

@NgModule({
  declarations: [
    DataPage,
    AnswersPage,
    ExportPage
  ],
  imports: [
    IonicPageModule.forChild(DataPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    DataPage,
    AnswersPage,
    ExportPage
  ]
})
export class DataPageModule { }
