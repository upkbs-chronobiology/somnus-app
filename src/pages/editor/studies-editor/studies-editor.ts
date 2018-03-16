import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
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

  constructor(studiesProvider: StudiesProvider, private componentFactoryResolver: ComponentFactoryResolver) {
    studiesProvider.listAll().subscribe(s => this.studies = s);
  }

  ionViewDidLoad() {
  }

  appendNew() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(StudyEditorComponent);
    const newItem = this.content.createComponent(factory);
    newItem.instance.newStudy = true;
    newItem.instance.create.subscribe(this.appendNew.bind(this));
  }
}
