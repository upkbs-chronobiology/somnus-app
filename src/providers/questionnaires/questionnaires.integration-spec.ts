import { AppModule } from '../../app/app.module';
import { loginAsTestUser, triggerReady } from '../../test/test-utils';
import { Observable } from 'rxjs/Observable';
import { Questionnaire } from '../../model/questionnaire';
import { QuestionnairesProvider } from './questionnaires';
import { TestBed } from '@angular/core/testing';

describe('QuestionnairesProvider', () => {

  let questionnaires: QuestionnairesProvider;

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });

    loginAsTestUser().subscribe(() => {
      questionnaires = TestBed.get(QuestionnairesProvider);

      done();
    });

    triggerReady();
  });

  it('should create questionnaires provider', () => {
    expect(questionnaires).toBeDefined();
  });

  it('should create, list, update, duplicate, delete questionnaires', done => {
    questionnaires.create(new Questionnaire(0, 'Testionnaire', null)).subscribe(q => {
      expect(q.id).toBeGreaterThan(0);
      expect(q.name).toBe('Testionnaire');
      expect(q.studyId).toBeFalsy();

      q.name = 'New name';

      questionnaires.update(q).subscribe(updated => {
        expect(updated.id).toBe(q.id);
        expect(updated.name).toBe('New name');

        questionnaires.duplicate(q.id).subscribe(dupe => {
          expect(dupe.id).not.toBe(q.id);
          expect(updated.name).toBe('New name');

          questionnaires.listAll().subscribe(allQs => {
            expect(allQs.length).toBe(2);
            const ids = allQs.map(x => x.id);
            expect(ids).toContain(q.id);
            expect(ids).toContain(dupe.id);

            Observable.forkJoin(ids.map(id => questionnaires.delete(id))).subscribe(() => {
              questionnaires.listAll().subscribe(finalList => {
                expect(finalList.length).toBe(0);
                done();
              });
            });
          });
        });
      });
    });
  });
});
