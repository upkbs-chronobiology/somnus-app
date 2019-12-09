import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Attribute, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { enumAsArray } from '../../util/enums';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { RichStudyAccess, StudyAccess, AccessLevel } from '../../model/study-access';
import { Role } from '../../model/role';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';
import { ToastProvider } from '../../providers/toast/toast';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';
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
  studyAcls: RichStudyAccess[];

  get currentUser(): User {
    return this.authentication.getCurrentUser();
  }

  accessUpdating: StudyAccess[] = [];

  accessLevels: AccessLevel[] = enumAsArray(AccessLevel);

  @Input()
  get study(): Study { return this._study; }
  set study(s: Study) {
    this._study = s;
    this.editedStudy = Study.clone(s);
  }

  @Output()
  create: EventEmitter<Study> = new EventEmitter();

  constructor(
    @Attribute('new') newAttr: string,
    private studiesProvider: StudiesProvider,
    private toast: ToastProvider,
    private modal: ModalController,
    private confirmation: ConfirmationProvider,
    private users: UsersProvider,
    private authentication: AuthenticationProvider,
  ) {
    this.newStudy = newAttr === '';
  }

  ngOnInit(): void {
    if (!this.study && !this.newStudy)
      console.error('Study editor instantiated without study item and not declared new');

    if (this.newStudy)
      this.study = new Study(0, null);

    if (this.study && !this.newStudy) {
      this.studiesProvider.listParticipants(this.study.id)
        .subscribe(users => this.participants = users);

      // XXX: Inefficient - consider:
      // - having a rest endpoint serving "rich" acls (with expanded users)
      // - looking up more selectively
      // - caching client-side
      this.users.listAll().subscribe(allUsers =>
        this.studiesProvider.listAcls(this.study.id)
          .map(sas => sas.map(sa => new RichStudyAccess(sa, allUsers.find(u => u.id === sa.userId))))
          .subscribe(rsas => this.studyAcls = rsas));
    } else {
      this.participants = [];
      this.studyAcls = [];
    }
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

        this.create.emit(this.study);
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

  updateAccess(access: StudyAccess) {
    this.accessUpdating.push(access);

    console.log(access.level);
    if (access.level)
      this.studiesProvider.updateAccess(access)
        .subscribe(() => this.accessUpdating.splice(this.accessUpdating.indexOf(access)));
    else
      this.studiesProvider.removeAccess(access)
        .subscribe(() => {
          this.studyAcls.splice(this.studyAcls.findIndex(a => a.userId === access.userId));
          this.accessUpdating.splice(this.accessUpdating.indexOf(access));
        });
  }

  addResearcher() {
    const overlay = this.modal.create(UserPickerComponent,
      { editorsOnly: true, exclude: this.studyAcls.map(a => a.user) });
    overlay.onWillDismiss((user: User) => {
      if (!user) return;

      // TODO: Prompt which level (rather than read-level initially)?
      const access = new StudyAccess(user.id, this.study.id, AccessLevel.Read);
      this.studiesProvider
        .updateAccess(access)
        .subscribe(() => this.studyAcls.push(new RichStudyAccess(access, user)));
    });
    overlay.present();
  }

  isUpdating(access: StudyAccess): boolean {
    return this.accessUpdating.indexOf(access) >= 0;
  }

  currentUserCanEditResearchers(): boolean {
    const access = this.currentUserAccess();
    return this.currentUser.role === Role.Admin ||
      access && access.level === AccessLevel.Own;
  }

  currentUserCanEditParticipants(): boolean {
    const access = this.currentUserAccess();
    return this.currentUser.role === Role.Admin ||
      access && [AccessLevel.Own, AccessLevel.Write].some(l => l === access.level);
  }

  private currentUserAccess(): StudyAccess {
    return this.studyAcls && this.studyAcls.find(a => a.userId === this.currentUser.id);
  }
}
