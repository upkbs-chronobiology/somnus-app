import { Answer } from '../../model/answer';
import { AnswersProvider } from './answers';
import { AnswerType } from '../../model/answer-type';
import { AppModule } from '../../app/app.module';
import { loginAsTestUser } from '../../test/test-utils';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../model/question';
import { QuestionsProvider } from '../questions/questions';
import { TestBed } from '@angular/core/testing';
import { ToastProvider } from '../toast/toast';

const mockToastProvider = {
  show(message) {
    throw new Error('Unexpected toast request: ' + message);
  }
};

describe('Answers', () => {

  let answers: AnswersProvider;
  let questions: QuestionsProvider;

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        { provide: ToastProvider, useValue: mockToastProvider }
      ]
    });

    loginAsTestUser().subscribe(() => {
      answers = TestBed.get(AnswersProvider);
      questions = TestBed.get(QuestionsProvider);
      done();
    });
  });

  it('should instantiate answers provider', () => {
    expect(answers).toBeDefined();
  });

  it('should send answers to the back end', done => {
    questions.create(new Question(undefined, 'Test Question', AnswerType.Text, undefined, undefined, undefined))
      .subscribe(newQuestion => {
        const answersToCreate = [
          new Answer('Test Answer A', newQuestion.id),
          new Answer('Test Answer B', newQuestion.id)
        ];
        answers.sendAll(answersToCreate).subscribe(newAnswers => {
          expect(newAnswers.length).toBe(2);
          expect(newAnswers.map(a => a.content)).toContain('Test Answer A');
          expect(newAnswers.map(a => a.content)).toContain('Test Answer B');

          Observable.zip(...newAnswers.map(a => answers.delete(a.id)))
            .subscribe(() => questions.delete(newQuestion.id)
              .subscribe(() => done()));
        });
      });
  });
});
