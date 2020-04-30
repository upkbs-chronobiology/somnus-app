import { ApplicationModule } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AlertButton, AlertController, IonicModule, NavParams, ViewController } from 'ionic-angular';
import { mockView } from 'ionic-angular/util/mock-providers';
import { Observable } from 'rxjs';
import { Schedule } from '../../model/schedule';
import { User } from '../../model/user';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ConfirmationProvider } from '../../providers/confirmation/confirmation';
import { SchedulesProvider } from '../../providers/schedules/schedules';
import { ToastProvider } from '../../providers/toast/toast';
import { ScheduleEditorComponent } from './schedule-editor';

fdescribe('LoginComponent', () => {

  const existingId = 7;
  const otherId = 8;
  const participant = new User('Luis Armstrong', null, 88);
  const otherUser = new User('Another One', null, 99);
  const existingSchedule = new Schedule(existingId, 1, participant.id, '2020-01-01', '2020-02-02', '08:00:00', '17:00:00', 66);
  const otherSchedule = new Schedule(otherId, 1, otherUser.id, '2020-01-01', '2020-02-02', '08:00:00', '17:00:00', 77);

  let component: ScheduleEditorComponent;
  let fixture: ComponentFixture<ScheduleEditorComponent>;

  let updatedSchedules: Schedule[];

  let mockNavParams = {
    data: {
      schedule: existingSchedule,
      participant: participant,
      allParticipants: [participant, otherUser],
      allSchedules: [existingSchedule, otherSchedule]
    }
  } as NavParams;

  const mockAlertController = {
    create: config => ({
      present: () => {
        // directly call handler for "copy" button with a target user name
        const copyButton = config.buttons[1] as AlertButton;
        setTimeout(() => copyButton.handler(otherUser.name), 0);
      }
    })
  } as AlertController;

  beforeEach(async(() => {
    updatedSchedules = [];
    let mockSchedulesProvider = {
      update: schedule => {
        updatedSchedules.push(schedule);
        return Observable.of(Schedule.clone(schedule));
      }
    } as SchedulesProvider;

    TestBed.configureTestingModule({
      declarations: [
        ScheduleEditorComponent
      ],
      imports: [
        ApplicationModule,
        IonicModule.forRoot(ScheduleEditorComponent),
        FormsModule
      ],
      providers: [
        { provide: SchedulesProvider, useValue: mockSchedulesProvider },
        { provide: NavParams, useValue: mockNavParams },
        { provide: ViewController, useValue: mockView() },
        { provide: AuthenticationProvider, useValue: {} as AuthenticationProvider },
        { provide: ConfirmationProvider, useValue: { confirm: () => Observable.of(true) } },
        { provide: ToastProvider, useValue: {} as ToastProvider },
        { provide: AlertController, useValue: mockAlertController },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => expect(component).toBeDefined());

  it('should retain schedule id when updating from another user', fakeAsync(() => {
    component.copyFromUser();

    // "selecting" the other user happens in the mock alert contoller
    tick();

    component.save();

    expect(updatedSchedules.length).toBe(1);
    expect(updatedSchedules[0].id).toBe(existingId);
  }));
});
