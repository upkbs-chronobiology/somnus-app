import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { groupArray } from '../../../util/arrays';
import { ModalController } from 'ionic-angular';
import { Optional } from '../../../util/optional';
import { Questionnaire } from '../../../model/questionnaire';
import { QuestionnaireEditorComponent } from '../../../components/questionnaire-editor/questionnaire-editor';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';
import { SchedulesEditorComponent } from '../schedules-editor/schedules-editor';
import { StudiesProvider } from '../../../providers/studies/studies';

@Component({
  selector: 'page-questionnaires-editor',
  templateUrl: 'questionnaires-editor.html',
})
export class QuestionnairesEditorPage {

  private _questionnaires: Questionnaire[];
  private get questionnaires(): Questionnaire[] {
    return this._questionnaires;
  }
  private set questionnaires(questionnaires: Questionnaire[]) {
    this._questionnaires = questionnaires;
    this.updateGroups();
  }

  groupedQuestionnaires: { [key: string]: Questionnaire[] };

  @ViewChild('newPlaceholder', { read: ViewContainerRef })
  newPlaceholder: ViewContainerRef;

  constructor(
    questionnaires: QuestionnairesProvider,
    private modal: ModalController,
    private studies: StudiesProvider
  ) {
    questionnaires.listAll().subscribe(q => this.questionnaires = q);
  }

  private updateGroups() {
    this.studies.listAll().subscribe(studies => {
      this.groupedQuestionnaires = groupArray(this.questionnaires, q => new Optional(studies.find(s => s.id === q.studyId))
        .map(s => s.name).getOrElse('<no study>'));
    });
  }

  create() {
    const overlay = this.modal.create(QuestionnaireEditorComponent, {}, { enableBackdropDismiss: false });
    overlay.onWillDismiss(data => {
      if (data.questionnaire)
        this.questionnaires[this.questionnaires.length] = data.questionnaire;
        this.updateGroups();
    });
    overlay.present();
  }


  edit(questionnaire: Questionnaire) {
    const index = this.questionnaires.indexOf(questionnaire);

    const overlay = this.modal.create(QuestionnaireEditorComponent, {
      questionnaire: this.questionnaires[index]
    }, { enableBackdropDismiss: false });

    overlay.onWillDismiss(data => {
      if (data.questionnaire) this.questionnaires[index] = data.questionnaire;
      else this.questionnaires.splice(index, 1);

      this.updateGroups();
    });

    overlay.present();
  }

  editSchedules(questionnaire: Questionnaire) {
    this.modal.create(SchedulesEditorComponent, {
      questionnaire: questionnaire
    }).present();
  }
}
