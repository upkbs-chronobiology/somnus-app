import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Questionnaire } from '../../../model/questionnaire';
import { QuestionnaireEditorComponent } from '../../../components/questionnaire-editor/questionnaire-editor';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';

@Component({
  selector: 'page-questionnaires-editor',
  templateUrl: 'questionnaires-editor.html',
})
export class QuestionnairesEditorPage {

  questionnaires: Questionnaire[];

  @ViewChild('newPlaceholder', { read: ViewContainerRef })
  newPlaceholder: ViewContainerRef;

  constructor(questionnaires: QuestionnairesProvider, private componentFactoryResolver: ComponentFactoryResolver) {
    questionnaires.listAll().subscribe(q => this.questionnaires = q);
  }

  ionViewDidLoad() {
  }

  appendNew() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(QuestionnaireEditorComponent);
    const newItem = this.newPlaceholder.createComponent(factory);
    newItem.instance.isNew = true;
    newItem.instance.create.subscribe(this.appendNew.bind(this));
  }
}
