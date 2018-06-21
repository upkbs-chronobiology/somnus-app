import { Component } from '@angular/core';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { getDailyTimes } from '../../util/schedules';
import { Moment } from 'moment';
import { NavParams, ViewController } from 'ionic-angular';
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
  editedSchedule: Schedule;
  participant: User;
  questionnaire: Questionnaire;

  isNew: boolean;

  showFrequencyInfo: boolean;

  constructor(
    params: NavParams,
    private view: ViewController,
    private confirmation: ConfirmationProvider,
    private schedules: SchedulesProvider,
    private toast: ToastProvider
  ) {
    this.schedule = params.data.schedule;
    this.participant = params.data.participant;
    this.questionnaire = params.data.questionnaire;

    this.isNew = !this.schedule;
    if (this.isNew)
      this.schedule = new Schedule(0, this.questionnaire.id, this.participant.id,
        null, null, null, null, null);
    this.editedSchedule = Schedule.clone(this.schedule);
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
    const operation = s => this.isNew ? this.schedules.create(s) : this.schedules.update(s);
    operation(this.editedSchedule)
      .catch((err, caught) => {
        const reason = err && err.message || '(unknown reason)';
        this.toast.show(`Failed to save schedule: ${reason}`, true);
        return Observable.empty();
      }).subscribe((createdSchedule: Schedule) => this.close(createdSchedule));
  }

  close(result?: Schedule) {
    this.view.dismiss({ schedule: result });
  }

  calculatePromptTimes(): Moment[] {
    return getDailyTimes(this.editedSchedule);
  }

  toggleFrequencyInfo() {
    this.showFrequencyInfo = !this.showFrequencyInfo;
  }
}
