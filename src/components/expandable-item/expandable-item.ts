import { Component } from '@angular/core';

@Component({
  selector: 'expandable-item',
  templateUrl: 'expandable-item.html'
})
export class ExpandableItemComponent {

  open: boolean = false;

  constructor() {
  }

}
