import { Attribute, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
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
export class QuestionnaireEditorComponent implements OnInit {

  @HostBinding('class.submitting')
  submitting: boolean;

  @HostBinding('class.deleted')
  deleted: boolean;

  editedQuestionnaire: Questionnaire;

  private _questionnaire: Questionnaire;
  @Input()
  set questionnaire(q: Questionnaire) {
    this._questionnaire = q;
    this.editedQuestionnaire = Questionnaire.clone(this._questionnaire);
  }
  get questionnaire(): Questionnaire { return this._questionnaire; }

  studies: Study[];

  isNew: boolean;

  @Output()
  create: EventEmitter<any> = new EventEmitter();

  constructor(
    @Attribute('new') newAttr: string,
    studiesProvider: StudiesProvider,
    private questionnairesProvider: QuestionnairesProvider,
    private toast: ToastProvider
  ) {
    this.isNew = newAttr === '';

    studiesProvider.listAll().subscribe(s => this.studies = s);
  }

  ngOnInit(): void {
    if (this.isNew) this.questionnaire = new Questionnaire(null, null, null);
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

      this.create.emit(null);
    });
  }

  submitUpdate() {
    this.questionnairesProvider.update(this.editedQuestionnaire).subscribe(q => {
      this.questionnaire = q;
      this.submitting = false;
    });
  }

  delete() {
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
        // XXX: Workaround for weird animation/transition-interference:
        // https://stackoverflow.com/questions/49651265/transition-right-after-animation?noredirect=1#comment86310950_49651265
        setTimeout(() => this.deleted = true, 0);
      });
  }
}
