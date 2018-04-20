import { AppModule } from '../../app/app.module';
import { AuthenticationProvider } from '../authentication/authentication';
import { loginAsTestUser } from '../../test/test-utils';
import { Questionnaire } from '../../model/questionnaire';
import { QuestionnairesProvider } from '../questionnaires/questionnaires';
import { Schedule } from '../../model/schedule';
import { SchedulesProvider } from './schedules';
import { TestBed } from '@angular/core/testing';

describe('SchedulesProvider', () => {

  let schedules: SchedulesProvider;

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });

    loginAsTestUser().subscribe(() => {
      schedules = TestBed.get(SchedulesProvider);

      done();
    });
  });

  it('should create schedules provider', () => {
    expect(schedules).toBeDefined();
  });

  it('should create, list, update, delete schedules', done => {
    const authentication: AuthenticationProvider = TestBed.get(AuthenticationProvider);
    const currentUser = authentication.getCurrentUser();

    const questionnaires = TestBed.get(QuestionnairesProvider);
    questionnaires.create(new Questionnaire(0, 'Testionnaire', undefined)).subscribe(questionnaire => {

      const schedule = new Schedule(0, questionnaire.id, currentUser.id, '2018-04-01', '2018-05-01', '12:00:00', '23:44:11', 7);
      schedules.create(schedule).subscribe(newSchedule => {
        expect(newSchedule.id).toBeGreaterThan(0);
        expect(newSchedule.questionnaireId).toBe(questionnaire.id);
        expect(newSchedule.userId).toBe(currentUser.id);
        expect(newSchedule.startDate).toBe('2018-04-01');
        expect(newSchedule.endDate).toBe('2018-05-01');
        expect(newSchedule.startTime).toBe('12:00:00');
        expect(newSchedule.endTime).toBe('23:44:11');
        expect(newSchedule.frequency).toBe(7);

        schedules.listMine().subscribe(mySchedules => {
          expect(mySchedules.length).toBeGreaterThan(0);
          expect(mySchedules).toContain(newSchedule);

          newSchedule.frequency = 12;

          schedules.update(newSchedule).subscribe(updatedSchedule => {
            expect(updatedSchedule.id).toBe(newSchedule.id);
            expect(updatedSchedule.questionnaireId).toBe(questionnaire.id);
            expect(updatedSchedule.userId).toBe(currentUser.id);
            expect(updatedSchedule.startDate).toBe('2018-04-01');
            expect(updatedSchedule.endDate).toBe('2018-05-01');
            expect(updatedSchedule.startTime).toBe('12:00:00');
            expect(updatedSchedule.endTime).toBe('23:44:11');
            expect(updatedSchedule.frequency).toBe(12);

            schedules.delete(newSchedule.id).subscribe(() => schedules.listMine().subscribe(mineAfterDeletion => {
              expect(mineAfterDeletion).not.toContain(updatedSchedule);

              questionnaires.delete(questionnaire.id).subscribe(() => done());
            }));
          });
        });
      });
    });
  });
});
