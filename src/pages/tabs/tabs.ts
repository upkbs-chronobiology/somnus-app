import { AboutPage } from '../about/about';
import { Component } from '@angular/core';
import { QuestionsPage } from '../questions/questions';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = QuestionsPage;
  tab2Root = AboutPage;

  constructor() {
  }

}
