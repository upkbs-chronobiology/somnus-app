import { Component, Input } from '@angular/core';

@Component({
  selector: 'input-error-hint',
  templateUrl: 'input-error-hint.html'
})
export class InputErrorHintComponent {

  @Input('condition')
  condition: boolean;

  constructor() {
  }

}
