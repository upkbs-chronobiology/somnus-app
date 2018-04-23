import { Component, HostBinding } from '@angular/core';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Questionnaire } from '../../model/questionnaire';
import { QuestionnairesProvider } from '../../providers/questionnaires/questionnaires';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'questionnaire-editor',
  templateUrl: 'questionnaire-editor.html'
})
export class QuestionnaireEditorComponent {

  @HostBinding('class.submitting')
  submitting: boolean;

  editedQuestionnaire: Questionnaire;

  private _questionnaire: Questionnaire;
  set questionnaire(q: Questionnaire) {
    this._questionnaire = q;
    this.editedQuestionnaire = Questionnaire.clone(this._questionnaire);
  }
  get questionnaire(): Questionnaire { return this._questionnaire; }

  studies: Study[];

  isNew: boolean;

  constructor(
    studiesProvider: StudiesProvider,
    private questionnairesProvider: QuestionnairesProvider,
    private toast: ToastProvider,
    private view: ViewController,
    params: NavParams,
    private confirmation: ConfirmationProvider
  ) {
    if (params.data.questionnaire) this.questionnaire = params.data.questionnaire;
    else if (!this.questionnaire) {
      this.questionnaire = new Questionnaire(null, null, null);
      this.isNew = true;
    }

    studiesProvider.listAll().subscribe(s => this.studies = s);
  }

  isValid(): boolean {
    return !!this.editedQuestionnaire.name;
  }

  isAltered(): boolean {
    return this.editedQuestionnaire.name !== this.questionnaire.name ||
      this.editedQuestionnaire.studyId !== this.questionnaire.studyId;
  }

  submit() {
    this.submitting = true;
    if (this.isNew) this.submitNew();
    else this.submitUpdate();
  }

  submitNew() {
    this.questionnairesProvider.create(this.editedQuestionnaire).subscribe(q => {
      this.questionnaire = q;
      this.isNew = false;
      this.submitting = false;

      this.close();
    });
  }

  submitUpdate() {
    this.questionnairesProvider.update(this.editedQuestionnaire).subscribe(q => {
      this.questionnaire = q;
      this.submitting = false;

      this.close();
    });
  }

  discard() {
    if (!this.isAltered()) {
      this.close(!this.isNew);
      return;
    }

    this.confirmation.confirm('Really drop changes?').subscribe(confirmed => {
      if (confirmed) this.close(!this.isNew);
    });
  }

  delete() {
    this.confirmation.confirm('Really delete?').subscribe(confirmed => {
      if (!confirmed) return;

      this.submitting = true;
      this.questionnairesProvider.delete(this.editedQuestionnaire.id)
        .catch((error, caught) => {
          if (!error.message)
            throw error;

          this.toast.show(`Failed to delete questionnaire: ${error.message}`, true);
          this.submitting = false;
          return Observable.empty();
        }).subscribe(() => {
          this.submitting = false;
          this.close(false);
        });
    });
  }

  private close(reportResult: boolean = true) {
    this.view.dismiss({
      questionnaire: reportResult ? this.questionnaire : undefined
    });
  }
}
