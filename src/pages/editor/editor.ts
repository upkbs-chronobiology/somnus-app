import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../../providers/questions/questions';

@IonicPage()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})
export class EditorPage {

  questions: Question[];

  newQuestionContent: string;
  creatingQuestion: boolean = false;

  constructor(private questionsProvider: QuestionsProvider) {
    questionsProvider.listAll().subscribe(list => this.questions = list);
  }

  ionViewDidLoad() {
  }

  createQuestion() {
    this.creatingQuestion = true;
    this.questionsProvider.create(new Question(0, this.newQuestionContent))
      .subscribe(createdQuestion => {
        this.questions.push(createdQuestion);
        this.newQuestionContent = '';
        this.creatingQuestion = false;
      });
  }
}
