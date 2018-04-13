import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Question } from '../../../model/question';
import { QuestionEditorComponent } from '../../../components/question-editor/question-editor';
import { Questionnaire } from '../../../model/questionnaire';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../../../providers/questions/questions';

@Component({
  selector: 'questions-editor',
  templateUrl: 'questions-editor.html'
})
export class QuestionsEditorPage {

  questions: Question[];
  questionnaires: Questionnaire[];

  constructor(
    questionsProvider: QuestionsProvider,
    questionnairesProvider: QuestionnairesProvider,
    private modal: ModalController
  ) {
    questionsProvider.listAll().subscribe(list => this.questions = list);
    questionnairesProvider.listAll().subscribe(list => this.questionnaires = list);
  }

  createQuestion() {
    const overlay = this.modal.create(QuestionEditorComponent,
      { question: undefined }, { enableBackdropDismiss: false });
    overlay.onWillDismiss(data => {
      if (data.question)
        this.questions.push(data.question);
    });
    overlay.present();
  }

  editQuestion(index: number) {
    const overlay = this.modal.create(QuestionEditorComponent,
      { question: this.questions[index] }, { enableBackdropDismiss: false });
    overlay.onWillDismiss(data => {
      if (data.question)
        this.questions[index] = data.question;
      else
        this.questions.splice(index, 1);
    });
    overlay.present();
  }
}
