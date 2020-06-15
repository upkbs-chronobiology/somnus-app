import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AnswersPage } from './answers/answers';
import { ExportPage } from './export/export';

@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

  answers = AnswersPage;
  export = ExportPage;

  constructor(
  ) { }
}
