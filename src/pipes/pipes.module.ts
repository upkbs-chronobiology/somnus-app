import { KeysPipe } from './keys/keys';
import { NgModule } from '@angular/core';
import { SortPipe } from './sort/sort';

@NgModule({
  declarations: [KeysPipe,
    SortPipe],
  imports: [],
  exports: [KeysPipe,
    SortPipe]
})
export class PipesModule { }
