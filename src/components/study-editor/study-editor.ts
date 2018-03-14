import { Attribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';

@Component({
  selector: 'study-editor',
  templateUrl: 'study-editor.html'
})
export class StudyEditorComponent implements OnInit {

  sending: boolean = false;

  editedStudy: Study;

  private _study: Study;

  newStudy: boolean;

  @Input()
  get study(): Study { return this._study; }
  set study(s: Study) {
    this._study = s;
    this.editedStudy = Study.clone(s);
  }

  @Output()
  create: EventEmitter<any> = new EventEmitter();

  constructor(@Attribute('new') newAttr: string, private studiesProvider: StudiesProvider) {
    this.newStudy = newAttr === '';
  }

  ngOnInit(): void {
    if (!this.study && !this.newStudy)
      console.error('Study editor instantiated without study item and not declared new');

    if (this.newStudy)
      this.study = new Study(0, null);
  }

  submit() {
    if (this.newStudy) this.submitCreation();
    else this.submitUpdate();
  }

  submitCreation() {
    this.studiesProvider.create(this.editedStudy)
      .subscribe(s => {
        this.study = s;
        this.newStudy = false;
        this.sending = false;

        this.create.emit(null);
      });
  }

  submitUpdate() {
    this.studiesProvider.update(this.editedStudy)
      .subscribe(s => {
        this.study = s;
        this.sending = false;
      });
  }
}
