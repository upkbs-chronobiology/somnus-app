import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import Chart, { ChartDataSets, ChartXAxe } from 'chart.js';
import moment from 'moment';
import { Observable } from 'rxjs';
import { Answer } from '../../../model/answer';
import { AnswerType } from '../../../model/answer-type';
import { Question } from '../../../model/question';
import { User } from '../../../model/user';
import { QuestionsProvider } from '../../../providers/questions/questions';
import { UsersProvider } from '../../../providers/users/users';
import { flatten, indexBy } from '../../../util/arrays';
import { getVividColor } from '../../../util/color';

const colorOpacity = 0.8;

const timeXAxe: ChartXAxe = {
  type: 'time',
  time: {
    minUnit: 'day'
  },
  bounds: 'ticks'
};

const defaultDatasetProps = {
  borderColor: '#0002',
  borderWidth: 1,
  barThickness: 6,
  pointRadius: 6,
  pointHoverRadius: 9,
  pointHitRadius: 9,
  showLine: false
};

@Component({
  selector: 'graphs',
  templateUrl: 'graphs.html'
})
export class GraphsPage {

  users: User[];
  questions: Question[];

  answers: Map<number, Answer[]>;
  questionsInScope: Question[];

  @ViewChildren('chartCanvas')
  chartCanvases: QueryList<ElementRef>;

  private charts: Map<number, Chart> = new Map();

  constructor(
    usersProvider: UsersProvider,
    questionsProvider: QuestionsProvider,
  ) {
    Observable.combineLatest(
      usersProvider.listAll(),
      questionsProvider.listAll()
    ).subscribe(([users, questions]) => {
      this.users = users;
      this.questions = questions;
    });
  }

  onAnswersChange(answers: Map<number, Answer[]>) {
    this.answers = answers;

    // This is to avoid "expression changed" errors
    this.questionsInScope = Array.from(this.answers.keys()).map(qId => this.questionById(qId));

    // Async call is needed in order for canvases to be rendered first
    setTimeout(() => this.updateCharts());
  }

  updateCharts() {
    this.chartCanvases.forEach(canvas => {
      const questionId = parseInt(canvas.nativeElement.dataset.questionId);
      this.drawChart(questionId, canvas);
    });
  }

  isTimeline(question: Question): boolean {
    return [AnswerType.Date, AnswerType.Text].includes(question.answerType);
  }

  drawChart(questionId: number, canvas: ElementRef) {
    const question = this.questionById(questionId);
    const answers = this.answers.get(questionId);
    const answersByUserId = indexBy(answers, a => a.userId);

    if (this.charts.has(questionId) && this.charts.get(questionId)) {
      this.charts.get(questionId).destroy();
      this.charts.delete(questionId);
    }

    let chart = this.createChart(question, answersByUserId, canvas);
    if (chart) chart.options.maintainAspectRatio = false;
    this.charts.set(questionId, chart);
  }

  private createChart(question: Question, answersByUserId: Map<number, Answer[]>, canvas: ElementRef) {
    switch (question.answerType) {
      case AnswerType.RangeDiscrete:
      case AnswerType.RangeContinuous:
        return this.createBarChart(answersByUserId, canvas, question.answerRange.min, question.answerRange.max);
      case AnswerType.MultipleChoiceSingle:
      case AnswerType.MultipleChoiceMany:
        const tickOptions = {
          suggestedMin: 0,
          suggestedMax: question.answerLabels.length - 1,
          stepSize: 1,
          reverse: true
        };
        // XXX: Labels might be easier using non-numeric y axis
        return this.createDotChart(answersByUserId, canvas, tickOptions, l => question.answerLabels[l]);
      case AnswerType.TimeOfDay:
        return this.createTimeOfDayChart(answersByUserId, canvas);
      case AnswerType.Date:
      case AnswerType.Text:
        return this.createTimeline(answersByUserId, canvas);
      default:
        throw new Error('Unkown answer type ' + question.answerType);
    }
  }

  private createTimeOfDayChart(answersByUserId: Map<number, Answer[]>, canvas: ElementRef) {
    const tickOptions = {
      suggestedMin: 0,
      suggestedMax: 24 * 3600 * 1000,
      stepSize: 3600 * 1000
    };
    const format = 'HH:mm';
    const valueExtractor = (c: string) => [moment(c, format).utc().diff(moment(c, format).utc().startOf('day'))];
    return this.createDotChart(answersByUserId, canvas, tickOptions, l => moment(l).utc().format(format), valueExtractor);
  }

  private createBarChart(answersByUserId: Map<number, Answer[]>, canvas: ElementRef, yMin: number, yMax: number, yStep = 0) {
    const datasets = Array.from(answersByUserId.keys())
      .map(uId => this.userById(uId))
      .map(user => this.datasetForUser(user, answersByUserId.get(user.id), a => [parseFloat(a.content)]));
    return new Chart(canvas.nativeElement, {
      type: 'bar',
      data: {
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [timeXAxe],
          yAxes: [{
            ticks: {
              suggestedMin: yMin,
              suggestedMax: yMax,
              stepSize: yStep
            }
          }]
        }
      }
    });
  }

  private createDotChart(
    answersByUserId: Map<number, Answer[]>,
    canvas: ElementRef,
    ticksOptions: {},
    labelConverter: (l: string | number) => string = l => l.toString(),
    valueExtractor: (c: string) => number[] = c => c.split(',').map(n => parseInt(n))
  ) {
    const datasets = Array.from(answersByUserId.keys())
      .map(uId => this.userById(uId))
      .map(user => this.datasetForUser(user, answersByUserId.get(user.id),
        a => valueExtractor(a.content)))
      .map(dataset => ({
        ...dataset,
        showLine: false,
      }));
    return new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [timeXAxe],
          yAxes: [{
            ticks: {
              ...ticksOptions,
              callback: labelConverter
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: items => labelConverter(items.yLabel)
          }
        }
      }
    });
  }

  private createTimeline(answersByUserId: Map<number, Answer[]>, canvas: ElementRef) {
    const userToDataset = (user: User) => {
      const color = getVividColor(user.name, colorOpacity);
      return {
        label: user.name,
        data: answersByUserId.get(user.id).map(a => ({
          x: moment(a.createdLocal).toDate(),
          y: 0,
          // XXX: Would only work with 'bubble' type, but that one has worse tooltips
          r: Math.max(Math.ceil(Math.log2(a.content.length)), 6),
          // XXX: Hacky
          answer: a
        })),
        backgroundColor: color,
        ...defaultDatasetProps
      };
    };
    const datasets = Array.from(answersByUserId.keys())
      .map(uId => this.userById(uId))
      .map(user => userToDataset(user));
    return new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [timeXAxe],
          yAxes: [{
            ticks: {
              display: false,
              suggestedMin: 0,
              suggestedMax: 0
            },
            gridLines: {
              lineWidth: 0
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              // XXX: Hacky
              const answer: Answer = data.datasets[item.datasetIndex].data[item.index]['answer'];
              return answer.content;
            }
          }
        }
      }
    });
  }

  private datasetForUser(user: User, answers: Answer[], yValues: (a: Answer) => number[]): ChartDataSets {
    const color = getVividColor(user.name, colorOpacity);
    return {
      label: user.name,
      data: flatten(answers.map(a => yValues(a).map(yVal => ({
        x: moment(a.createdLocal).toDate(),
        y: yVal
      })))),
      backgroundColor: color,
      ...defaultDatasetProps
    };
  }

  private questionById(qId: number): Question {
    return this.questions.find(q => q.id === qId);
  }

  private userById(uId: number): User {
    return this.users.find(u => u.id === uId);
  }
}
