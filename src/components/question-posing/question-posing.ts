import { Answer } from '../../model/answer';
import { AnswerType } from '../../model/answer-type';
import { Checkbox, Platform } from 'ionic-angular';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Question } from '../../model/question';

@Component({
  selector: 'question-posing',
  templateUrl: 'question-posing.html'
})
export class QuestionPosingComponent {

  AnswerType = AnswerType;

  @Input()
  question: Question;

  @Input()
  answer: Answer;

  // XXX: Maybe extract checkbox-grouping functionality to another component (similar to radio-group)
  @ViewChildren(Checkbox)
  checkboxes: QueryList<Checkbox>;

  constructor(private platform: Platform) {
  }

  isMultipleChoice(): boolean {
    return [AnswerType.MultipleChoiceSingle, AnswerType.MultipleChoiceMany]
      .indexOf(this.question.answerType) >= 0;
  }

  checkboxChange() {
    const indices: number[] = this.checkboxes.filter(checkbox => checkbox.value)
      .map(checkbox => checkbox.getNativeElement().getAttribute('data-index'));
    this.answer.content = indices.join(',');
  }

  isPortrait(): boolean {
    return this.platform.isPortrait();
  }
}
