import { Component, HostBinding } from '@angular/core';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Questionnaire } from '../../model/questionnaire';
import { QuestionnairesProvider } from '../../providers/questionnaires/questionnaires';
import { Schedule } from '../../model/schedule';
import { ScheduleEditorComponent } from '../schedule-editor/schedule-editor';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';
import { ToastProvider } from '../../providers/toast/toast';
import { User } from '../../model/user';

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
  participants: User[];
  private schedules: Schedule[];

  isNew: boolean;

  constructor(
    private studiesProvider: StudiesProvider,
    private questionnairesProvider: QuestionnairesProvider,
    private schedulesProvider: SchedulesProvider,
    private toast: ToastProvider,
    private view: ViewController,
    params: NavParams,
    private confirmation: ConfirmationProvider,
    private modal: ModalController
  ) {
    if (params.data.questionnaire) this.questionnaire = params.data.questionnaire;
    else if (!this.questionnaire) {
      this.questionnaire = new Questionnaire(null, null, null);
      this.isNew = true;
    }

    studiesProvider.listAll().subscribe(s => this.studies = s);
    this.updateParticipants();
  }

  updateParticipants() {
    if (!this.editedQuestionnaire.studyId) {
      this.participants = [];
      this.schedules = [];
      return;
    }

    const participants = this.studiesProvider.listParticipants(this.editedQuestionnaire.studyId);
    const schedules = this.schedulesProvider.listForQuestionnaire(this.editedQuestionnaire.id);
    Observable.combineLatest(participants, schedules).subscribe((results: [User[], Schedule[]]) => {
      this.participants = results[0];
      this.schedules = results[1];
    });
  }

  getScheduleFor(participant: User): Schedule {
    return this.schedules.find(s => s.userId === participant.id);
  }

  editSchedule(participant: User) {
    let schedule = this.schedules.find(s => s.userId === participant.id);

    const overlay = this.modal.create(ScheduleEditorComponent, {
      schedule: schedule,
      participant: participant,
      questionnaire: this.editedQuestionnaire
    }, { enableBackdropDismiss: false });

    overlay.onWillDismiss(data => {
      if (!data.schedule) return;

      // newly created
      if (!schedule) {
        this.schedules.push(data.schedule);
        return;
      }

      // updated
      const index = this.schedules.indexOf(schedule);
      this.schedules[index] = data.schedule;
    });

    overlay.present();
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
