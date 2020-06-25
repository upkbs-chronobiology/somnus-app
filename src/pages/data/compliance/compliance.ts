import { Component, ViewChild } from '@angular/core';
import moment from 'moment';
import { AnswersFilterComponent } from '../../../components/answers-filter/answers-filter';
import { Answer } from '../../../model/answer';
import { Question } from '../../../model/question';
import { Schedule } from '../../../model/schedule';
import { User } from '../../../model/user';
import { QuestionsProvider } from '../../../providers/questions/questions';
import { UsersProvider } from '../../../providers/users/users';
import { flatten, indexBy } from '../../../util/arrays';
import { getVividColor } from '../../../util/color';
import { transformValues } from '../../../util/maps';
import { ScheduleAnalyzer } from '../../../util/schedule-analyzer';
import { Prompt, ScheduleManager } from '../../../util/schedule-manager';

@Component({
  selector: 'compliance',
  templateUrl: 'compliance.html'
})
export class CompliancePage {

  readonly maxPrompts = 50;
  readonly dateFormat = 'YYYY-MM-DD HH:mm';

  @ViewChild(AnswersFilterComponent)
  answersFilter: AnswersFilterComponent;

  fromDate: string;
  toDate: string;

  schedulesByUser: Map<number, Schedule[]>;
  allPrompts: Prompt[];
  answersByQuestion: Map<number, Answer[]>;
  userIndex: Map<number, User>;
  questionsIndex: Map<number, Question>;
  answersByPrompt: Map<Prompt, Answer[]>;

  constructor(
    users: UsersProvider,
    questions: QuestionsProvider
  ) {
    users.listAll().subscribe(users =>
      this.userIndex = transformValues(indexBy(users, u => u.id), ([u]) => u));
    questions.listAll().subscribe(questions => {
      this.questionsIndex = transformValues(indexBy(questions, q => q.id), ([q]) => q);
      this.updateAnswersByPrompt();
    });
  }

  refresh() {
    this.answersByPrompt = null;
    this.answersFilter.refresh();
  }

  onSchedulesChange(schedulesByUser: Map<number, Schedule[]>) {
    this.schedulesByUser = schedulesByUser;

    const allSchedules = flatten(Array.from(schedulesByUser.values()));
    const reference = this.toDate ? moment(this.toDate).endOf('day') : moment();

    this.allPrompts = new ScheduleManager(allSchedules).pastNDues(this.maxPrompts, reference);
    if (this.fromDate)
      this.allPrompts = this.allPrompts.filter(p => p.moment > moment(this.fromDate).startOf('day'));
    this.allPrompts.sort((a, b) => b.moment.diff(a.moment));

    this.updateAnswersByPrompt();
  }

  onAnswersChange(answers: Map<number, Answer[]>) {
    this.answersByQuestion = answers;
    this.updateAnswersByPrompt();
  }

  private updateAnswersByPrompt() {
    if (!this.schedulesByUser || !this.allPrompts || !this.answersByQuestion || !this.questionsIndex) return;

    const analyzersByUser: Map<number, ScheduleAnalyzer[]> =
      transformValues(this.schedulesByUser, ss => ss.map(s => new ScheduleAnalyzer(s)));
    const byUserAndQuestionnaire: Map<number, Map<number, ScheduleAnalyzer[]>> =
      transformValues(analyzersByUser, as => indexBy(as, a => a.schedule.questionnaireId));

    this.answersByPrompt = new Map();
    this.answersByQuestion.forEach((answers, _questionId) => {
      answers.forEach(a => {
        const questionnaireId = this.questionsIndex.get(a.questionId).questionnaireId;
        if (!byUserAndQuestionnaire.has(a.userId) || !byUserAndQuestionnaire.get(a.userId).has(questionnaireId))
          return;

        const analyzer: ScheduleAnalyzer = byUserAndQuestionnaire.get(a.userId).get(questionnaireId)[0];
        const answerPromptMoment = analyzer.getMostRecent(moment(a.createdLocal));
        // XXX: Find might be expensive - use indexed version of allPrompts?
        const prompt = this.allPrompts.find(p =>
          p.schedule.userId === a.userId &&
          p.schedule.questionnaireId === questionnaireId &&
          p.moment.isSame(answerPromptMoment));

        if (!this.answersByPrompt.has(prompt)) this.answersByPrompt.set(prompt, []);
        this.answersByPrompt.get(prompt).push(a);
      });
    });
  }

  dataReady(): boolean {
    return !!this.answersByPrompt && !!this.userIndex;
  }

  answersFor(prompt: Prompt): Answer[] {
    return this.answersByPrompt.get(prompt) || [];
  }

  userById(id: number): User {
    return this.userIndex.get(id);
  }

  questionById(id: number): Question {
    return this.questionsIndex.get(id);
  }

  userColor(id: number): string {
    return getVividColor(this.userById(id).name);
  }

  lightUserColor(id: number): string {
    return getVividColor(this.userById(id).name, 0.1);
  }

  creationString(answer: Answer): string {
    return moment(answer.createdLocal).format('HH:mm');
  }

  answerDelay(prompt: Prompt, answer: Answer): string {
    return prompt.moment.to(moment(answer.createdLocal), true);
  }
}
