import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { StudiesProvider } from '../../../providers/studies/studies';
import { Study } from '../../../model/study';
import { StudyEditorComponent } from '../../../components/study-editor/study-editor';

@Component({
  selector: 'page-studies-editor',
  templateUrl: 'studies-editor.html',
})
export class StudiesEditorPage {

  studies: Study[];

  @ViewChild('newPlaceholder', { read: ViewContainerRef })
  content: ViewContainerRef;

  @ViewChild('newStudy', { read: ElementRef })
  newStudy: ElementRef;

  constructor(private studiesProvider: StudiesProvider, private componentFactoryResolver: ComponentFactoryResolver) {
    this.loadData();
  }

  private loadData() {
    delete this.studies;
    this.studiesProvider.listAll().subscribe(s => this.studies = s);
  }

  ionViewDidLoad() {
  }

  appendNew(study: Study) {
    this.studies.push(study);
    this.newStudy.nativeElement.remove();

    const factory = this.componentFactoryResolver.resolveComponentFactory(StudyEditorComponent);
    const newItem = this.content.createComponent(factory);

    newItem.instance.newStudy = true;
    newItem.instance.create.subscribe(s => {
      this.appendNew(s);
      newItem.destroy();
    });
  }
}
