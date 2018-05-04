import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';

@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

  studies: Study[];
  studyToExport: Study;
  blobUrl: SafeUrl;

  loading: boolean;

  constructor(
    studiesProvider: StudiesProvider,
    private data: DataProvider,
    private domSanitizer: DomSanitizer
  ) {
    studiesProvider.listAll().subscribe(s => this.studies = s);
  }

  ionViewDidLoad() {
  }

  fetch(study: Study) {
    this.loading = true;
    this.data.fetch(study.id).subscribe(blob => {
      this.loading = false;
      this.blobUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    });
  }

  flush() {
    delete this.blobUrl;
  }
}
