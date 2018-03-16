import { Component, Input } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'user-editor',
  templateUrl: 'user-editor.html'
})
export class UserEditorComponent {

  @Input()
  user: User;

  constructor() {
  }

}
