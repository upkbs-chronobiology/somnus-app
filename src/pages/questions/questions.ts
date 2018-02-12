import { Component } from '@angular/core';
import { Question } from '../../model/question';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { QuestionsProvider } from '../../providers/questions/questions';

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})
export class QuestionsPage implements OnInit {

  questions: Question[];

  constructor(private questionsProvider: QuestionsProvider) {

  }

  ngOnInit(): void {
    this.questionsProvider.listAll().subscribe(questions => this.questions = questions);
  }
}
