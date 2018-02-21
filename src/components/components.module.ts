import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login';
import { IonicModule } from 'ionic-angular';
import { CentrizerComponent } from './centrizer/centrizer';

@NgModule({
  declarations: [LoginComponent,
    CentrizerComponent],
  imports: [
    IonicModule,
  ],
  exports: [LoginComponent,
    CentrizerComponent],
  entryComponents: [LoginComponent]
})
export class ComponentsModule { }
