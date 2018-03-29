import { Attribute, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Questionnaire } from '../../model/questionnaire';
import { QuestionnairesProvider } from '../../providers/questionnaires/questionnaires';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';

@Component({
  selector: 'questionnaire-editor',
  templateUrl: 'questionnaire-editor.html'
})
export class QuestionnaireEditorComponent implements OnInit {

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
    private questionnairesProvider: QuestionnairesProvider
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
    this.questionnairesProvider.delete(this.editedQuestionnaire.id).subscribe(() => {

      this.submitting = false;
    });
  }
}
