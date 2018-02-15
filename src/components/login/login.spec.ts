import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { IonicModule, ToastController, ViewController } from 'ionic-angular';
import { LoginComponent } from './login';
import { ApplicationModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        ApplicationModule,
        IonicModule.forRoot(LoginComponent),
        FormsModule
      ],
      providers: [
        { provide: AuthenticationProvider, useValue: {} as AuthenticationProvider },
        { provide: ViewController, useValue: {} as ViewController },
        { provide: ToastController, useValue: {} as ToastController },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => expect(component).toBeDefined());
});
