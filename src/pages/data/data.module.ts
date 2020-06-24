import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AnswersPage } from './answers/answers';
import { CompliancePage } from './compliance/compliance';
import { DataPage } from './data';
import { ExportPage } from './export/export';
import { GraphsPage } from './graphs/graphs';

@NgModule({
  declarations: [
    DataPage,
    AnswersPage,
    ExportPage,
    GraphsPage,
    CompliancePage
  ],
  imports: [
    IonicPageModule.forChild(DataPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    DataPage,
    AnswersPage,
    ExportPage,
    GraphsPage,
    CompliancePage
  ]
})
export class DataPageModule { }
