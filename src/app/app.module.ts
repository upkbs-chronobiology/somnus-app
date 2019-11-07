import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Device } from '@ionic-native/device/ngx';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ComponentsModule } from '../components/components.module';
import { AboutPage } from '../pages/about/about';
import { DataPage } from '../pages/data/data';
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
    ComponentsModule,
    EditorPageModule
  ],
  bootstrap: [MyApp],
  entryComponents: [
    MyApp,
    AboutPage,
    QuestionsPage,
    TabsPage,
    DataPage
  ],
  providers: [
    StatusBar,
    HeaderColor,
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
  ]
})
export class AppModule { }
