import { Answer } from '../../model/answer';
import { AnswerType } from '../../model/answer-type';
import { Checkbox, Platform } from 'ionic-angular';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import moment from 'moment';
import { Question } from '../../model/question';

@Component({
  selector: 'question-posing',
  templateUrl: 'question-posing.html'
})
export class QuestionPosingComponent {

  AnswerType = AnswerType;

  MaxDate = `${new Date().getFullYear() + 100}-12-31`;

  TimeFormat = moment.localeData(window.navigator.language).longDateFormat('LT');
  TimePlaceholder = this.TimeFormat;

  DateFormat = moment.localeData(window.navigator.language).longDateFormat('L');
  DatePlaceholder = this.DateFormat;

  @Input()
  question: Question;

  @Input()
  answer: Answer;

  // XXX: Maybe extract checkbox-grouping functionality to another component (similar to radio-group)
  @ViewChildren(Checkbox)
  checkboxes: QueryList<Checkbox>;

  constructor(private platform: Platform) {
  }

  isRangeQuestion(): boolean {
    return [AnswerType.RangeContinuous, AnswerType.RangeDiscrete]
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
