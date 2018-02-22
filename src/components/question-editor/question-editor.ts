import { Component, Input, HostBinding } from '@angular/core';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../../providers/questions/questions';
import { ToastProvider } from '../../providers/toast/toast';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'question-editor',
  templateUrl: 'question-editor.html'
})
export class QuestionEditorComponent {

  submitting: boolean = false;

  @HostBinding('class.deleted')
  deleted: boolean = false;

  private _question: Question;

  newContent: string;

  get question(): Question {
    return this._question;
  }

  @Input()
  set question(question: Question) {
    this._question = question;
    this.newContent = question.content;
  }

  constructor(private questions: QuestionsProvider, private toast: ToastProvider) {
  }

  save() {
    this.submitting = true;
    this.questions.update(new Question(this.question.id, this.newContent))
      .subscribe(updatedQuestion => {
        this.question = updatedQuestion;
        this.submitting = false;
      });
  }

  // TODO: Confirmation?
  delete() {
    this.questions.delete(this.question.id)
    .catch((error, caught) => {
      this.toast.show(error.message, true);
      return Observable.empty();
    })
    .subscribe(() => this.deleted = true);
  }
}
