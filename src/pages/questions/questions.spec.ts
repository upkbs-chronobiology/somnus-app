import { ApplicationModule, ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, Platform } from 'ionic-angular';
import { MockPlatform } from 'ionic-angular/util/mock-providers';
import moment from 'moment';
import { Observable } from 'rxjs';
import { ComponentsModule } from '../../components/components.module';
import { Answer } from '../../model/answer';
import { AnswerType } from '../../model/answer-type';
import { InclusiveRange } from '../../model/inclusive-range';
import { Question } from '../../model/question';
import { Schedule } from '../../model/schedule';
import { AnswersProvider } from '../../providers/answers/answers';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { QuestionsProvider } from '../../providers/questions/questions';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { ToastProvider } from '../../providers/toast/toast';
import { QuestionsPage } from './questions';


const dateFormat = 'YYYY-MM-DD';

describe('QuestionsProvider', () => {

    const now = moment();

    let mockNotificationsProvider: NotificationsProvider;
    let mockSchedulesProvider: SchedulesProvider;
    let mockAnswersProvider: AnswersProvider;
    let mockQuestionsProvider: QuestionsProvider;
    let mockToastProvider: ToastProvider;
    const mockChangeDetectorRef = {} as ChangeDetectorRef;
    const mockPlatform = new MockPlatform();

    let questionsPage: QuestionsPage;
    let fixture: ComponentFixture<QuestionsPage>;
    let savedAnswers: Answer[]

    function setUpComponents() {
        TestBed.configureTestingModule({
            declarations: [
                QuestionsPage,
            ],
            imports: [
                ApplicationModule,
                ComponentsModule,
                IonicModule.forRoot(QuestionsPage),
            ],
            providers: [
                { provide: SchedulesProvider, useValue: mockSchedulesProvider },
                { provide: AnswersProvider, useValue: mockAnswersProvider },
                { provide: QuestionsProvider, useValue: mockQuestionsProvider },
                { provide: ToastProvider, useValue: mockToastProvider },
                { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
                { provide: NotificationsProvider, useValue: mockNotificationsProvider },
                { provide: Platform, useValue: mockPlatform },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QuestionsPage);
        questionsPage = fixture.componentInstance;
    }

    beforeEach(() => {
        mockNotificationsProvider = {
            cancelAll: () => Promise.resolve(),
            schedule: _ => { }
        } as NotificationsProvider;
        mockSchedulesProvider = {} as SchedulesProvider;
        savedAnswers = [];
        mockAnswersProvider = {
            sendAll: answers => {
                savedAnswers.push(...answers);
                return Observable.of(answers);
            },
            // assume question id euqals questionnaire id
            listMineByQuestionnaire: qreId => Observable.of(savedAnswers.filter(a => a.questionId === qreId))
        } as AnswersProvider;
        mockQuestionsProvider = {
            listByQuestionnaire: qreId => Observable.of([
                new Question(qreId, 'Sample question', AnswerType.RangeDiscrete, ['a', 'b'], new InclusiveRange(0, 2), 0)
            ])
        } as QuestionsProvider;
        mockToastProvider = {
            show: _ => { }
        } as ToastProvider;
    });

    describe('multiple questionnaires scheduled at the same time', () => {

        beforeEach(() => {
            const tomorrow = now.clone().add(1, 'day');
            mockSchedulesProvider.listMine = () => Observable.of([
                new Schedule(0, 0, 0, now.format(dateFormat), tomorrow.format(dateFormat), '00:00:00', '00:01:00', 1),
                new Schedule(1, 1, 0, now.format(dateFormat), tomorrow.format(dateFormat), '00:00:00', '00:01:00', 1)
            ]);

            setUpComponents();
            // questionsPage.ngOnInit();
        });

        afterEach(fakeAsync(() => {
            tick();
        }));

        it('should create component', () => expect(questionsPage).toBeDefined());

        it('should present one after another', () => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expectOneQuestionAndSubmit();

                fixture.detectChanges();
                fixture.whenRenderingDone().then(() => {
                    expect(savedAnswers.length).toBe(1);
                    expectOneQuestionAndSubmit();

                    fixture.detectChanges();
                    fixture.whenRenderingDone().then(() => {
                        expect(savedAnswers.length).toBe(2);
                        expect(questionsPage.questions.length).toBe(0);
                    });
                });
            });
        });
    });

    function expectOneQuestionAndSubmit() {
        expect(questionsPage.questions.length).toBe(1);
        const rangeEl = fixture.debugElement.query(By.css('ion-range'));
        expect(rangeEl).toBeTruthy();
        const submitButton = fixture.debugElement.query(By.css('button[ion-fab]'));
        expect(submitButton).toBeTruthy();
        submitButton.triggerEventHandler('click', null);
    }
});
