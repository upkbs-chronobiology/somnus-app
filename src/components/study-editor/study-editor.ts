import { Attribute, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';
import { ToastProvider } from '../../providers/toast/toast';
import { User } from '../../model/user';
import { UserPickerComponent } from '../user-picker/user-picker';
import 'rxjs/operator/finally';

@Component({
  selector: 'study-editor',
  templateUrl: 'study-editor.html'
})
export class StudyEditorComponent implements OnInit {

  @HostBinding('class.sending')
  sending: boolean = false;

  @HostBinding('class.deleted')
  deleted: boolean = false;

  editedStudy: Study;

  private _study: Study;

  newStudy: boolean;

  participants: User[];

  @Input()
  get study(): Study { return this._study; }
  set study(s: Study) {
    this._study = s;
    this.editedStudy = Study.clone(s);
  }

  @Output()
  create: EventEmitter<any> = new EventEmitter();

  constructor(
    @Attribute('new') newAttr: string,
    private studiesProvider: StudiesProvider,
    private toast: ToastProvider,
    private modal: ModalController,
    private confirmation: ConfirmationProvider
  ) {
    this.newStudy = newAttr === '';
  }

  ngOnInit(): void {
    if (!this.study && !this.newStudy)
      console.error('Study editor instantiated without study item and not declared new');

    if (this.newStudy)
      this.study = new Study(0, null);

    if (this.study)
      this.studiesProvider.listParticipants(this.study.id)
        .subscribe(users => this.participants = users);
    else
      this.participants = [];
  }

  submit() {
    if (this.newStudy) this.submitCreation();
    else this.submitUpdate();
  }

  submitCreation() {
    this.sending = true;
    this.studiesProvider.create(this.editedStudy)
      .subscribe(s => {
        this.study = s;
        this.newStudy = false;
        this.sending = false;

        this.create.emit(null);
      });
  }

  submitUpdate() {
    this.sending = true;
    this.studiesProvider.update(this.editedStudy)
      .subscribe(s => {
        this.study = s;
        this.sending = false;
      });
  }

  delete() {
    this.confirmation.confirm('Really delete?').subscribe(confirmed => {
      if (!confirmed) return;

      this.sending = true;
      this.studiesProvider.delete(this.editedStudy.id)
        .finally(() => this.sending = false)
        .catch((error, caught) => {
          if (error.message) {
            this.toast.show(`Study deletion failed: ${error.message}`, true);
            return Observable.empty();
          }

          return Observable.throw(error);
        })
        .subscribe(() => {
          this.sending = false;
          // XXX: Workaround for weird animation/transition-interference:
          // https://stackoverflow.com/questions/49651265/transition-right-after-animation?noredirect=1#comment86310950_49651265
          setTimeout(() => this.deleted = true, 0);
        });
    });
  }

  isAltered(): boolean {
    return this.editedStudy.name !== this.study.name;
  }

  addParticipant() {
    const overlay = this.modal.create(UserPickerComponent, { exclude: this.participants });
    overlay.onWillDismiss((user: User) => {
      if (!user || this.participants.find(p => p.id === user.id)) return;

      this.participants.push(user);

      this.sending = true;
      this.studiesProvider.addParticipant(this.study.id, user.id)
        .subscribe(() => this.sending = false);
    });
    overlay.present();
  }

  removeParticipant(user: User) {
    const index = this.participants.indexOf(user);
    if (index < 0) {
      console.warn(`Tried to remove user ${user.name} from participants, but that one's not in the list.`);
      return;
    }
    this.participants.splice(index, 1);

    this.sending = true;
    this.studiesProvider.removeParticipant(this.study.id, user.id)
      .subscribe(() => this.sending = false);
  }
}
