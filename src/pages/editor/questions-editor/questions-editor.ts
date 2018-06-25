import { Component } from '@angular/core';
import { groupArray } from '../../../util/arrays';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Optional } from '../../../util/optional';
import { Question } from '../../../model/question';
import { QuestionEditorComponent } from '../../../components/question-editor/question-editor';
import { QuestionnairesProvider } from '../../../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../../../providers/questions/questions';
import { StudiesProvider } from '../../../providers/studies/studies';

@Component({
  selector: 'questions-editor',
  templateUrl: 'questions-editor.html'
})
export class QuestionsEditorPage {

  private questions: Question[];

  groupedQuestions: { [key: string]: Question[] };

  constructor(
    questionsProvider: QuestionsProvider,
    private studiesProvider: StudiesProvider,
    private questionnairesProvider: QuestionnairesProvider,
    private modal: ModalController
  ) {
    questionsProvider.listAll().subscribe(list => {
      this.questions = list;
      this.updateGroupedQuestions();
    });
  }

  private updateGroupedQuestions() {
    Observable.combineLatest(
      this.studiesProvider.listAll(),
      this.questionnairesProvider.listAll()
    ).subscribe(([studies, questionnaires]) => {
      this.groupedQuestions = groupArray(this.questions, question => {
        const questionnaire = new Optional(questionnaires.find(qe => qe.id === question.questionnaireId));
        const study = questionnaire.map(qe => studies.find(s => s.id === qe.studyId));

        const questionnaireLabel = questionnaire.map(qe => `${qe.id}: ${qe.name}`).getOrElse('<no questionnaire>');
        const studyLabel = study.map(s => `${s.id}: ${s.name}`).getOrElse('<no study>');

        return `${studyLabel} / ${questionnaireLabel}`;
      });
    });
  }

  createQuestion() {
    const overlay = this.modal.create(QuestionEditorComponent,
      { question: undefined }, { enableBackdropDismiss: false });
    overlay.onWillDismiss(data => {
      if (!data.question) return;

      this.questions.push(data.question);
      this.updateGroupedQuestions();
    });
    overlay.present();
  }

  editQuestion(question: Question) {
    const index = this.questions.indexOf(question);

    const overlay = this.modal.create(QuestionEditorComponent,
      { question: this.questions[index] }, { enableBackdropDismiss: false });

    overlay.onWillDismiss(data => {
      if (data.question)
        this.questions[index] = data.question;
      else
        this.questions.splice(index, 1);

      this.updateGroupedQuestions();
    });

    overlay.present();
  }
}
