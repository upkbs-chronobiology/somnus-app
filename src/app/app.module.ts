import { AboutPage } from '../pages/about/about';
import { AnswersProvider } from '../providers/answers/answers';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AuthRestProvider } from '../providers/auth-rest/auth-rest';
import { BrowserModule } from '@angular/platform-browser';
import { CacheProvider } from '../providers/cache/cache';
import { ComponentsModule } from '../components/components.module';
import { ConfirmationProvider } from '../providers/confirmation/confirmation';
import { DataPage } from '../pages/data/data';
import { EditorPageModule } from '../pages/editor/editor.module';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { QuestionnairesProvider } from '../providers/questionnaires/questionnaires';
import { QuestionsPage } from '../pages/questions/questions';
import { QuestionsProvider } from '../providers/questions/questions';
import { RestProvider } from '../providers/rest/rest';
import { SchedulesProvider } from '../providers/schedules/schedules';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { StudiesProvider } from '../providers/studies/studies';
import { TabsPage } from '../pages/tabs/tabs';
import { ToastProvider } from '../providers/toast/toast';
import { UsersProvider } from '../providers/users/users';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    QuestionsPage,
    TabsPage,
    DataPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule,
    EditorPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    QuestionsPage,
    TabsPage,
    DataPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthenticationProvider,
    RestProvider,
    HttpClientModule,
    QuestionsProvider,
    AnswersProvider,
    AuthRestProvider,
    ToastProvider,
    StudiesProvider,
    CacheProvider,
    UsersProvider,
    QuestionnairesProvider,
    ConfirmationProvider,
    SchedulesProvider,
  ]
})
export class AppModule { }
