import { AnswerType } from '../../model/answer-type';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../../providers/questions/questions';
import { StudiesProvider } from '../../providers/studies/studies';
import { Study } from '../../model/study';

@IonicPage()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})
export class EditorPage {

  // XXX: Some duplication with question-editor
  answerTypes: AnswerType[] = Object.keys(AnswerType).map(key => AnswerType[key]);
  answerTypeLabels = {
    [AnswerType.Text]: 'Text',
    [AnswerType.RangeContinuous]: 'Continuous Range (0-1)',
    [AnswerType.RangeDiscrete5]: 'Discrete Range (1-5)',
  };

  questions: Question[];
  studies: Study[];

  newQuestion: Question = new Question(0, '', null, null);
  creatingQuestion: boolean = false;

  constructor(private questionsProvider: QuestionsProvider, private studiesProvider: StudiesProvider) {
    questionsProvider.listAll().subscribe(list => this.questions = list);
    studiesProvider.listAll().subscribe(list => this.studies = list);
  }

  ionViewDidLoad() {
  }

  createQuestion() {
    this.creatingQuestion = true;
    this.questionsProvider.create(this.newQuestion)
      .subscribe(createdQuestion => {
        this.questions.push(createdQuestion);
        this.newQuestion = new Question(0, '', null, null);
        this.creatingQuestion = false;
      });
  }
}
