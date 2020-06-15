import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Study } from '../../../model/study';
import { DataProvider } from '../../../providers/data/data';
import { StudiesProvider } from '../../../providers/studies/studies';

@Component({
  selector: 'page-export',
  templateUrl: 'export.html',
})
export class ExportPage {

  studies: Study[];
  studyToExport: Study;
  blobUrl: SafeUrl;

  loading: boolean;

  constructor(
    private studiesProvider: StudiesProvider,
    private data: DataProvider,
    private domSanitizer: DomSanitizer
  ) {
    this.loadData();
  }

  private loadData() {
    delete this.studies;
    this.studiesProvider.listAll().subscribe(s => this.studies = s);
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
