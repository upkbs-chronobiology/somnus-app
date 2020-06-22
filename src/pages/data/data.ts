import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AnswersPage } from './answers/answers';
import { ExportPage } from './export/export';
import { GraphsPage } from './graphs/graphs';

@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

  answers = AnswersPage;
  graphs = GraphsPage;
  export = ExportPage;

  constructor(
  ) { }
}
