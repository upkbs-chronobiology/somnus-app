import { AnswerType } from '../../model/answer-type';
import { Component, HostBinding, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../../providers/questions/questions';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'question-editor',
  templateUrl: 'question-editor.html'
})
export class QuestionEditorComponent {

  // XXX: Some duplication with editor
  answerTypes: AnswerType[] = Object.keys(AnswerType).map(key => AnswerType[key]);
  answerTypeLabels = {
    [AnswerType.Text]: 'Text',
    [AnswerType.RangeContinuous]: 'Continuous Range (0-1)',
    [AnswerType.RangeDiscrete5]: 'Discrete Range (1-5)',
  };

  studies: Study[];

  submitting: boolean = false;

  @HostBinding('class.deleted')
  deleted: boolean = false;

  private _question: Question;

  editedQuestion: Question;

  get question(): Question {
    return this._question;
  }

  @Input()
  set question(question: Question) {
    this._question = question;
    this.editedQuestion = Question.clone(question);
  }

  constructor(
    private questions: QuestionsProvider,
    studiesProvider: StudiesProvider,
    private toast: ToastProvider
  ) {
    studiesProvider.listAll().subscribe(list => this.studies = list);
  }

  save() {
    this.submitting = true;
    this.questions.update(this.editedQuestion)
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

  questionEdited(): boolean {
    return this.editedQuestion.content !== this.question.content ||
      this.editedQuestion.answerType !== this.question.answerType ||
      this.editedQuestion.studyId !== this.question.studyId;
  }

  requiredMissing(): boolean {
    return !this.editedQuestion.content || !this.editedQuestion.answerType;
  }
}
