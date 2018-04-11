import { AnswerType } from '../../model/answer-type';
import { arraysEqual } from '../../util/arrays';
import { Component, HostBinding, Input } from '@angular/core';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { InclusiveRange } from '../../model/inclusive-range';
import { NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../model/question';
import { Questionnaire } from '../../model/questionnaire';
import { QuestionnairesProvider } from '../../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../../providers/questions/questions';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'question-editor',
  templateUrl: 'question-editor.html'
})
export class QuestionEditorComponent {
  AnswerType = AnswerType;

  answerTypes: AnswerType[] = Object.keys(AnswerType).map(key => AnswerType[key]);
  answerTypeLabels = {
    [AnswerType.Text]: 'Text',
    [AnswerType.RangeContinuous]: 'Continuous range',
    [AnswerType.RangeDiscrete]: 'Discrete range',
    [AnswerType.MultipleChoice]: 'Multiple choice'
  };

  questionnaires: Questionnaire[];

  @HostBinding('class.submitting')
  submitting: boolean = false;

  private _question: Question;
  editedQuestion: Question;
  isNew: boolean;

  get question(): Question {
    return this._question;
  }

  @Input()
  set question(question: Question) {
    this._question = question;
    this.editedQuestion = Question.clone(question);

    this.updateOptionals();
  }

  constructor(
    private questions: QuestionsProvider,
    questionnairesProvider: QuestionnairesProvider,
    private toast: ToastProvider,
    private view: ViewController,
    params: NavParams,
    private confirmation: ConfirmationProvider
  ) {
    if (params.data.question) this.question = params.data.question;
    else if (!this.question) {
      this.question = new Question(0, '', null, null, null, null);
      this.isNew = true;
    }

    questionnairesProvider.listAll().subscribe(list => this.questionnaires = list);
  }

  getRangePoints(): number {
    return this.editedQuestion.answerRange.max - this.editedQuestion.answerRange.min + 1;
  }

  updateOptionals() {
    const q = this.editedQuestion;

    if ([AnswerType.RangeContinuous, AnswerType.RangeDiscrete].indexOf(q.answerType) < 0)
      delete q.answerRange;
    else if (!q.answerRange)
      q.answerRange = new InclusiveRange(null, null);

    switch (q.answerType) {
      case AnswerType.MultipleChoice:
        if (!q.answerLabels || q.answerLabels.length === 0)
          q.answerLabels = [''];
        break;
      case AnswerType.RangeContinuous:
        if (!q.answerLabels || q.answerLabels.length !== 2)
          q.answerLabels = ['', ''];
        break;
      case AnswerType.RangeDiscrete:
        const numItems = this.getRangePoints();
        if (!q.answerLabels || q.answerLabels.length !== numItems)
          q.answerLabels = new Array(numItems);
        break;
      default:
        delete q.answerLabels;
    }
  }

  trackLabelFor(index: number, item: any) {
    // XXX: Correct?
    return index;
  }

  discard() {
    if (!this.questionEdited())
      this.close(false);
    else
      this.confirmation.confirm('This will drop unsaved changes - are you sure?')
        .subscribe(response => {
          if (response) this.close(false);
        });
  }

  save() {
    const send = (this.isNew ? this.questions.create : this.questions.update).bind(this.questions);

    this.submitting = true;
    send(this.editedQuestion)
      .subscribe(updatedQuestion => {
        this.question = updatedQuestion;
        this.submitting = false;
        this.close();
      });
  }

  delete() {
    this.confirmation.confirm('Do you really want to delete this question?')
      .subscribe(response => {
        if (response)
          this.questions.delete(this.question.id)
            .catch((error, caught) => {
              this.toast.show(error.message, true);
              return Observable.empty();
            })
            .subscribe(() => this.close());
      });
  }

  questionEdited(): boolean {
    return this.editedQuestion.content !== this.question.content ||
      this.editedQuestion.answerType !== this.question.answerType ||
      // double (and not triple) equals check to cover null vs. undefined
      this.editedQuestion.answerRange != this.question.answerRange ||
      !arraysEqual(this.editedQuestion.answerLabels, this.question.answerLabels) ||
      this.editedQuestion.questionnaireId !== this.question.questionnaireId;
  }

  requiredMissing(): boolean {
    return !this.editedQuestion.content || !this.editedQuestion.answerType ||
      this.editedQuestion.answerType === AnswerType.MultipleChoice && this.editedQuestion.answerLabels.indexOf('') >= 0;
  }

  close(deliverResult: boolean = true) {
    this.view.dismiss({
      question: deliverResult ? this.question : undefined
    });
  }
}
