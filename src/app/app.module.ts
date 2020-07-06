import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { HeaderColor } from '@ionic-native/header-color';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ComponentsModule } from '../components/components.module';
import { AboutPage } from '../pages/about/about';
import { DataPageModule } from '../pages/data/data.module';
import { EditorPageModule } from '../pages/editor/editor.module';
import { QuestionsPage } from '../pages/questions/questions';
import { TabsPage } from '../pages/tabs/tabs';
import { AnswersProvider } from '../providers/answers/answers';
import { AuthRestProvider } from '../providers/auth-rest/auth-rest';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { CacheProvider } from '../providers/cache/cache';
import { ConfirmationProvider } from '../providers/confirmation/confirmation';
import { DataProvider } from '../providers/data/data';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { QuestionnairesProvider } from '../providers/questionnaires/questionnaires';
import { QuestionsProvider } from '../providers/questions/questions';
import { RestProvider } from '../providers/rest/rest';
import { SchedulesProvider } from '../providers/schedules/schedules';
import { StudiesProvider } from '../providers/studies/studies';
import { ToastProvider } from '../providers/toast/toast';
import { UsersProvider } from '../providers/users/users';
import { MyApp } from './app.component';
import { PreferencesProvider } from '../providers/preferences/preferences';
import { OrganizationsProvider } from '../providers/organizations/organizations';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    QuestionsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule,
    EditorPageModule,
    DataPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    QuestionsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    HeaderColor,
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
    DataProvider,
    LocalNotifications,
    NotificationsProvider,
    Device,
    AppVersion,
    KeychainTouchId,
    PreferencesProvider,
    OrganizationsProvider,
  ]
})
export class AppModule { }
