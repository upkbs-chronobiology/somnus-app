import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Questionnaire } from '../../../model/questionnaire';
import { QuestionnaireEditorComponent } from '../../../components/questionnaire-editor/questionnaire-editor';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';
import { SchedulesEditorComponent } from '../schedules-editor/schedules-editor';

@Component({
  selector: 'page-questionnaires-editor',
  templateUrl: 'questionnaires-editor.html',
})
export class QuestionnairesEditorPage {

  questionnaires: Questionnaire[];

  @ViewChild('newPlaceholder', { read: ViewContainerRef })
  newPlaceholder: ViewContainerRef;

  constructor(
    questionnaires: QuestionnairesProvider,
    private modal: ModalController
  ) {
    questionnaires.listAll().subscribe(q => this.questionnaires = q);
  }

  ionViewDidLoad() {
  }

  create() {
    const overlay = this.modal.create(QuestionnaireEditorComponent, {}, { enableBackdropDismiss: false });
    overlay.onWillDismiss(data => {
      if (data.questionnaire)
        this.questionnaires[this.questionnaires.length] = data.questionnaire;
    });
    overlay.present();
  }

  edit(index: number) {
    const overlay = this.modal.create(QuestionnaireEditorComponent, {
      questionnaire: this.questionnaires[index]
    }, { enableBackdropDismiss: false });
    overlay.onWillDismiss(data => {
      if (data.questionnaire) this.questionnaires[index] = data.questionnaire;
      else this.questionnaires.splice(index, 1);
    });
    overlay.present();
  }

  editSchedules(questionnaire: Questionnaire) {
    this.modal.create(SchedulesEditorComponent, {
      questionnaire: questionnaire
    }).present();
  }
}
