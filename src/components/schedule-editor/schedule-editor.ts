import { Component } from '@angular/core';
import { AlertController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { Questionnaire } from '../../model/questionnaire';
import { Schedule } from '../../model/schedule';
import { User } from '../../model/user';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { QuestionnairesProvider } from '../../providers/questionnaires/questionnaires';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { StudiesProvider } from '../../providers/studies/studies';
import { ToastProvider } from '../../providers/toast/toast';
import { filterAsync } from '../../util/arrays';
import { ScheduleAnalyzer } from '../../util/schedule-analyzer';

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
    private alertController: AlertController,
    private questionnaires: QuestionnairesProvider,
    private studies: StudiesProvider,
    private loadingController: LoadingController
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
      .catch((err, _caught) => {
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

  async copyFromQuestionnaireAndUser() {
    const allQuestionnaires = await this.questionnaires.listAll().toPromise();
    const allStudies = await this.studies.listAll().toPromise();

    this.alertController.create({
      title: 'Which questionnaire to copy from?',
      inputs: allQuestionnaires.map(q => ({
        type: 'radio',
        label: `${allStudies.find(s => s.id === q.studyId).name} / ${q.name}`,
        value: q.id.toString()
      })),
      buttons: [
        'Cancel',
        {
          text: 'Next: Select user',
          handler: data => {
            if (!data) {
              this.toast.show('No questionnaire selected, nothing was copied');
              return;
            }
            this.copyFromUser(allQuestionnaires.find(q => q.id.toString() === data));
          }
        }
      ]
    }).present();
  }

  async copyFromUser(questionnaire?: Questionnaire) {
    const loading = this.loadingController.create();
    loading.present();

    const participants: User[] = await (questionnaire ?
      this.studies.listParticipants(this.questionnaire.studyId).toPromise() :
      this.allParticipants.filter(p => p !== this.participant)
    );

    const psNoSchedule =
      (await filterAsync(participants, async p => !(await this.getScheduleForUser(p, questionnaire))))
        .map(p => p.name);
    const alert = this.alertController.create({
      title: 'What user to copy from?',
      inputs: (await filterAsync(participants, async p => !!(await this.getScheduleForUser(p, questionnaire))))
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
          handler: data => {
            this.insertFromUser(this.allParticipants.find(p => p.name === data), questionnaire);
          }
        }
      ]
    });

    alert.present();
    loading.dismiss();
  }

  private async insertFromUser(user?: User, questionnaire?: Questionnaire) {
    if (!user) {
      this.alertController.create({
        title: 'No user selected',
        subTitle: 'Nothing has been copied.',
        buttons: ['Ok']
      }).present();
      return;
    }

    const loading = this.loadingController.create();
    loading.present();

    this.editedSchedule = Schedule.clone(await this.getScheduleForUser(user, questionnaire));
    this.editedSchedule.id = this.isNew ? 0 : this.schedule.id;
    this.editedSchedule.userId = this.participant.id;
    this.editedSchedule.questionnaireId = this.questionnaire.id;

    loading.dismiss();
  }

  private async getScheduleForUser(user: User, questionnaire?: Questionnaire): Promise<Schedule> {
    const schedules = await (questionnaire ?
      this.schedules.listForQuestionnaire(questionnaire.id).toPromise() :
      this.allSchedules
    );
    // XXX: Inefficient lookup - consider a map if this is too slow
    return schedules.find(s => s.userId === user.id);
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
