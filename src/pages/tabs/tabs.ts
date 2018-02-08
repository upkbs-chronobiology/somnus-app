import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { QuestionsPage } from '../questions/questions';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { RestProvider } from '../../providers/rest/rest';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LoginComponent } from '../../components/login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  tab1Root = QuestionsPage;
  tab2Root = AboutPage;

  constructor(private rest: RestProvider, private modal: ModalController) {
  }

  ngOnInit(): void {
    if (!this.rest.isLoggedIn())
      this.modal.create(LoginComponent).present();
  }
}
