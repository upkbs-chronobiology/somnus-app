import { AlertController, NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { ScheduleAnalyzer } from '../../util/schedule-analyzer';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { Questionnaire } from '../../model/questionnaire';
import { Schedule } from '../../model/schedule';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { ToastProvider } from '../../providers/toast/toast';
import { User } from '../../model/user';

@Component({
  selector: 'schedule-editor',
  templateUrl: 'schedule-editor.html'
})
export class ScheduleEditorComponent {

  schedule: Schedule;
  allSchedules: Schedule[];
  editedSchedule: Schedule;
  participant: User;
  allParticipants: User[];
  questionnaire: Questionnaire;
  scheduleAnalyzer: ScheduleAnalyzer;

  isNew: boolean;

  showFrequencyInfo: boolean;

  submitting: boolean;

  constructor(
    params: NavParams,
    private view: ViewController,
    private confirmation: ConfirmationProvider,
    private schedules: SchedulesProvider,
    private toast: ToastProvider,
    private alertController: AlertController
  ) {
    this.schedule = params.data.schedule;
    this.allSchedules = params.data.allSchedules;
    this.participant = params.data.participant;
    this.allParticipants = params.data.allParticipants;
    this.questionnaire = params.data.questionnaire;

    this.isNew = !this.schedule;
    if (this.isNew)
      this.schedule = new Schedule(0, this.questionnaire.id, this.participant.id,
        null, null, null, null, null);
    this.editedSchedule = Schedule.clone(this.schedule);
    this.scheduleAnalyzer = new ScheduleAnalyzer(this.editedSchedule);
  }

  isValid(): boolean {
    const s = this.editedSchedule;
    return !!(s.startDate && s.endDate && s.startTime && s.endTime && s.frequency) &&
      this.isValidDate(s.startDate) && this.isValidDate(s.endDate) &&
      this.isValidTime(s.startTime) && this.isValidTime(s.endTime);
  }

  private isValidDate(dateString: string): boolean {
    return !!new Date(dateString).getTime();
  }

  private isValidTime(timeString: string): boolean {
    const parts = timeString.split(':');
    return timeString.length === 8 && parts.length === 3 &&
      parseInt(parts[0]) < 24 && parseInt(parts[1]) <= 60 && parseInt(parts[2]) <= 60;
  }

  isAltered() {
    return !Schedule.equal(this.schedule, this.editedSchedule);
  }

  discard() {
    if (!this.isAltered()) this.close();
    else
      this.confirmation.confirm('Really drop changes?').subscribe(confirmed => {
        if (confirmed) this.close();
      });
  }

  save() {
    this.submitting = true;
    const operation = s => this.isNew ? this.schedules.create(s) : this.schedules.update(s);
    operation(this.editedSchedule)
      .finally(() => this.submitting = false)
      .catch((err, caught) => {
        const reason = err && err.message || '(unknown reason)';
        this.toast.show(`Failed to save schedule: ${reason}`, true);
        return Observable.empty();
      }).subscribe((createdSchedule: Schedule) => this.close(createdSchedule));
  }

  close(result?: Schedule, deletion?: boolean) {
    this.view.dismiss({ schedule: result, deletion: deletion });
  }

  calculatePromptTimes(): Moment[] {
    return this.scheduleAnalyzer.getDailyTimes();
  }

  toggleFrequencyInfo() {
    this.showFrequencyInfo = !this.showFrequencyInfo;
  }

  copyFromUser() {
    const psNoSchedule =
      this.allParticipants.filter(p => p !== this.participant && !this.getScheduleForUser(p))
        .map(p => p.name);
    const alert = this.alertController.create({
      title: 'What user to copy from?',
      inputs: this.allParticipants.filter(p => p !== this.participant)
        .filter(p => !!this.getScheduleForUser(p))
        .map(p => ({
          type: 'radio',
          label: p.name,
          value: p.name
        })),
      message: psNoSchedule.length &&
        `${psNoSchedule.join(', ')} ${psNoSchedule.length === 1 ? 'has' : 'have'} no schedule`,
      buttons: [
        'Cancel',
        {
          text: 'Copy',
          handler: data => this.insertFromUser(this.allParticipants.find(p => p.name === data))
        }
      ]
    });

    alert.present();
  }

  private insertFromUser(user: User) {
    if (!user) {
      this.alertController.create({
        title: 'No user selected',
        subTitle: 'Nothing has been copied.',
        buttons: ['Ok']
      }).present();
      return;
    }

    this.editedSchedule = Schedule.clone(this.getScheduleForUser(user));
    this.editedSchedule.userId = this.participant.id;
  }

  private getScheduleForUser(user: User): Schedule {
    // XXX: Inefficient lookup - consider a map if this is too slow
    return this.allSchedules.find(s => s.userId === user.id);
  }

  confirmDelete() {
    this.confirmation.confirm('Really delete?')
      .filter(confirmed => confirmed)
      .flatMap(() => {
        this.submitting = true;
        return this.schedules.delete(this.schedule.id);
      })
      .finally(() => this.submitting = false)
      .subscribe(() => this.close(this.schedule, true));
  }
}
