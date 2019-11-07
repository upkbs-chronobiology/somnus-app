import { Component } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestionnaireEditorComponent } from '../../../components/questionnaire-editor/questionnaire-editor';
import { Questionnaire } from '../../../model/questionnaire';
import { ConfirmationProvider } from '../../../providers/confirmation/confirmation';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';
import { StudiesProvider } from '../../../providers/studies/studies';
import { groupArray } from '../../../util/arrays';
import { Optional } from '../../../util/optional';
import { ensure } from '../../../util/streams';
import { SchedulesEditorComponent } from '../schedules-editor/schedules-editor';

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

  constructor(
    private questionnairesProvider: QuestionnairesProvider,
    private modal: ModalController,
    private studies: StudiesProvider,
    private loadingController: LoadingController,
    private confirmation: ConfirmationProvider
  ) {
    this.loadData();
  }

  private loadData(): Observable<any> {
    delete this.groupedQuestionnaires;
    return ensure(this.questionnairesProvider.listAll().pipe(map(q => this.questionnaires = q)));
  }

  private updateGroups() {
    this.studies.listAll().subscribe(studies => {
      this.groupedQuestionnaires = groupArray(this.questionnaires, q => new Optional(studies.find(s => s.id === q.studyId))
        .map(s => `${s.id}: ${s.name}`).getOrElse('<no study>'));
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

  duplicate(questionnaire: Questionnaire) {
    this.confirmation.confirm('This will duplicate this questionnaire and all its questions. Continue?').subscribe(confirmed => {
      if (!confirmed) return;

      const loading = this.loadingController.create();
      loading.present();

      this.questionnairesProvider.duplicate(questionnaire.id).subscribe(dupe => {
        loading.dismiss();
        this.loadData().subscribe(() => this.edit(this.questionnaires.find(q => q.id === dupe.id)));
      });
    });
  }

  editSchedules(questionnaire: Questionnaire) {
    this.modal.create(SchedulesEditorComponent, {
      questionnaire: questionnaire
    }).present();
  }
}
