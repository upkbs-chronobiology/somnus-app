import { Answer } from '../../model/answer';
import { AnswersProvider } from '../../providers/answers/answers';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../../providers/questions/questions';
import { ToastProvider } from '../../providers/toast/toast';
import { AnswerType } from '../../model/answer-type';

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})
export class QuestionsPage implements OnInit {

  AnswerType = AnswerType;

  questions: Question[];

  answers: Answer[];

  submitting: boolean = false;

  constructor(
    private questionsProvider: QuestionsProvider,
    private answersProvider: AnswersProvider,
    private toast: ToastProvider,
  ) {
  }

  ngOnInit(): void {
    this.questionsProvider.listAll().subscribe(questions => {
      this.questions = questions;
      this.answers = questions.map(q => {
        const answer = new Answer(null, q.id);
        // default sliders to center
        if (q.answerType === AnswerType.RangeContinuous) answer.content = '0.5';
        if (q.answerType === AnswerType.RangeDiscrete5) answer.content = '3';
        return answer;
      });
    });
  }

  everthingAnswered(): boolean {
    return this.answers && this.answers.every(a => !!a.content);
  }

  submitAnswers(): void {
    this.submitting = true;
    this.answersProvider.sendAll(this.answers).subscribe(createdAnswers => {
      this.submitting = false;
      this.questions = [];
      this.toast.show(`${createdAnswers.length} answers successfully submitted`);
    }, error => {
      this.submitting = false;
      this.toast.show(`Answer submission failed: ${error.message || error}`, true);
    });
  }

  isValidAnswer(value: any): boolean {
    return typeof(value) === 'number' || !!value;
  }
}
