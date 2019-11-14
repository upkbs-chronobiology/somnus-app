import { ApplicationModule } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CentrizerComponent } from '../centrizer/centrizer';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewController } from 'ionic-angular';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id';
import { LoginComponent } from './login';
import { mockView } from 'ionic-angular/util/mock-providers';
import { ToastProvider } from '../../providers/toast/toast';

const fakeKeychainTouchId: KeychainTouchId = {
  isAvailable: () => Promise.reject('this is just fake')
} as KeychainTouchId;

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        CentrizerComponent
      ],
      imports: [
        ApplicationModule,
        IonicModule.forRoot(LoginComponent),
        FormsModule
      ],
      providers: [
        { provide: AuthenticationProvider, useValue: {} as AuthenticationProvider },
        { provide: ViewController, useValue: mockView() },
        { provide: ToastProvider, useValue: {} as ToastProvider },
        { provide: KeychainTouchId, useValue: fakeKeychainTouchId },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => expect(component).toBeDefined());
});
