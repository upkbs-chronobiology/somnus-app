import { AppModule } from '../../app/app.module';
import { AuthenticationProvider } from '../authentication/authentication';
import { Credentials } from '../../model/credentials';
import { ModalController } from 'ionic-angular';
import { StudiesProvider } from './studies';
import { Study } from '../../model/study';
import { TestBed } from '@angular/core/testing';

describe('Studies', () => {

  let studies: StudiesProvider;

  beforeEach(done => {
    // XXX: Hacky as hell
    let authToken;
    const mockModalController = {
      create: () => ({
        present: () => { },
        onDidDismiss: cb => setTimeout(() => cb(authToken), 0),
      })
    };

    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        { provide: ModalController, useValue: mockModalController }
      ]
    });

    // XXX: Authentication (and credentials) - modularize, make configurable etc.?
    const authProvider: AuthenticationProvider = TestBed.get(AuthenticationProvider);
    authProvider.login(new Credentials('test-user', 'test-user')).subscribe(token => {
      authToken = token;
      studies = TestBed.get(StudiesProvider);
      done();
    });
  });

  it('should instatiate studies provider', () => {
    expect(studies).toBeDefined();
  });

  it('should create, read, update, delete studies', done => {
    studies.create(new Study(0, 'Foo')).subscribe(newStudy => {
      expect(newStudy.id).toBeGreaterThan(0);
      expect(newStudy.name).toBe('Foo');

      studies.listAll().subscribe(studyList => {
        expect(studyList.length).toBeGreaterThan(0);
        expect(studyList).toContain(newStudy);

        newStudy.name = 'Bar';

        studies.update(newStudy).subscribe(updatedStudy => {
          expect(updatedStudy.id).toBe(newStudy.id);
          expect(updatedStudy.name).toBe('Bar');

          studies.delete(newStudy.id).subscribe(() => studies.listAll().subscribe(studyList => {
            expect(studyList).not.toContain(newStudy);
            expect(studyList).not.toContain(updatedStudy);

            done();
          }));
        });
      });
    });
  });
});
