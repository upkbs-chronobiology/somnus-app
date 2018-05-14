import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'centrizer',
  templateUrl: 'centrizer.html'
})
export class CentrizerComponent {

  @HostBinding('class.vertical')
  @Input()
  vertical: boolean = true;

  constructor() {
  }

}
