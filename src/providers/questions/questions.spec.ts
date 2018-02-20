import { AppModule } from '../../app/app.module';
import { AuthRestProvider } from '../auth-rest/auth-rest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Platform } from 'ionic-angular';
import { QuestionsProvider } from './questions';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { RestProvider } from '../rest/rest';

const mockAuthRestProvider = {} as AuthRestProvider;

describe('QuestionsProvider', () => {

  let questionsProvider: QuestionsProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
      ],
    }).compileComponents();
    questionsProvider = new QuestionsProvider(mockAuthRestProvider);
  });

  it('should create component', () => expect(questionsProvider).toBeDefined());
});
