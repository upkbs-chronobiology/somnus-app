import { AnswerType } from '../../../model/answer-type';
import { Component } from '@angular/core';
import { Question } from '../../../model/question';
import { Questionnaire } from '../../../model/questionnaire';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../../../providers/questions/questions';

@Component({
  selector: 'questions-editor',
  templateUrl: 'questions-editor.html'
})
export class QuestionsEditorPage {

  // XXX: Some duplication with question-editor
  answerTypes: AnswerType[] = Object.keys(AnswerType).map(key => AnswerType[key]);
  answerTypeLabels = {
    [AnswerType.Text]: 'Text',
    [AnswerType.RangeContinuous]: 'Continuous Range (0-1)',
    [AnswerType.RangeDiscrete5]: 'Discrete Range (1-5)',
  };

  questions: Question[];
  questionnaires: Questionnaire[];

  newQuestion: Question = new Question(0, '', null, null);
  creatingQuestion: boolean = false;

  constructor(private questionsProvider: QuestionsProvider, questionnairesProvider: QuestionnairesProvider) {
    questionsProvider.listAll().subscribe(list => this.questions = list);
    questionnairesProvider.listAll().subscribe(list => this.questionnaires = list);
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
