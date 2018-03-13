import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StudiesProvider } from '../../../providers/studies/studies';
import { Study } from '../../../model/study';

@Component({
  selector: 'page-studies-editor',
  templateUrl: 'studies-editor.html',
})
export class StudiesEditorPage {

  studies: Study[];

  constructor(private studiesProvider: StudiesProvider) {
    studiesProvider.listAll().subscribe(s => this.studies = s);
  }

  ionViewDidLoad() {
  }

}
