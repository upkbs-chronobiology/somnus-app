import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { Questionnaire } from '../../../model/questionnaire';
import { Schedule } from '../../../model/schedule';
import { ScheduleEditorComponent } from '../../../components/schedule-editor/schedule-editor';
import { SchedulesProvider } from '../../../providers/schedules/schedules';
import { StudiesProvider } from '../../../providers/studies/studies';
import { User } from '../../../model/user';

@Component({
  selector: 'schedules-editor',
  templateUrl: 'schedules-editor.html'
})
export class SchedulesEditorComponent {

  questionnaire: Questionnaire;

  participants: User[];
  schedules: Schedule[];

  constructor(
    private view: ViewController,
    params: NavParams,
    private studiesProvider: StudiesProvider,
    private schedulesProvider: SchedulesProvider,
    private modal: ModalController
  ) {
    this.questionnaire = params.data.questionnaire;
    this.loadParticipants();
  }

  loadParticipants() {
    if (!this.questionnaire.studyId) return;

    const participants = this.studiesProvider.listParticipants(this.questionnaire.studyId);
    const schedules = this.schedulesProvider.listForQuestionnaire(this.questionnaire.id);
    combineLatest(participants, schedules).subscribe((results: [User[], Schedule[]]) => {
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
      allSchedules: this.schedules,
      participant: participant,
      allParticipants: this.participants,
      questionnaire: this.questionnaire
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

  close() {
    this.view.dismiss();
  }
}
