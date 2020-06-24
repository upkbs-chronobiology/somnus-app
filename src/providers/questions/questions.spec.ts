import { TestBed } from '@angular/core/testing';
import { AuthRestProvider } from '../auth-rest/auth-rest';
import { CacheProvider } from '../cache/cache';
import { QuestionsProvider } from './questions';

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
    questionsProvider = new QuestionsProvider(mockAuthRestProvider, new CacheProvider());
  });

  it('should create component', () => expect(questionsProvider).toBeDefined());
});
