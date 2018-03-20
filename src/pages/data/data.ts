import { Answer } from '../../model/answer';
import { AnswersProvider } from '../../providers/answers/answers';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../../providers/questions/questions';

@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

  answers: Answer[];
  questions: Question[];

  constructor(answersProvider: AnswersProvider, questionsProvider: QuestionsProvider) {
    const answerObservable = answersProvider.listAll();
    const questionsObservable = questionsProvider.listAll();
    // make sure we have both results before assigning them
    Observable.combineLatest(answerObservable, questionsObservable)
      .subscribe((results: [Answer[], Question[]]) => {
        this.answers = results[0];
        this.questions = results[1];
      });
  }

  ionViewDidLoad() {
  }

  getAnswersTo(question: Question) {
    return this.answers.filter(a => a.questionId === question.id);
  }
}
