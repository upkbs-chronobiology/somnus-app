import { Component } from '@angular/core';
import { Question } from '../../model/question';
import { Answer } from '../../model/answer';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { QuestionsProvider } from '../../providers/questions/questions';
import { AnswersProvider } from '../../providers/answers/answers';

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})
export class QuestionsPage implements OnInit {

  questions: Question[];

  answers: Answer[];

  constructor(
    private questionsProvider: QuestionsProvider,
    private answersProvider: AnswersProvider
  ) {
  }

  ngOnInit(): void {
    this.questionsProvider.listAll().subscribe(questions => {
      this.questions = questions;
      this.answers = questions.map(q => new Answer(null, q.id));
    });
  }

  everthingAnswered(): boolean {
    return this.answers && this.answers.every(a => !!a.content);
  }

  submitAnswers(): void {
    this.answersProvider.sendAll(this.answers);
  }
}
