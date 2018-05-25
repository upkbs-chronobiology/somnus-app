import { Optional } from '../../util/optional';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(array: any[], ...args) {
    return array.sort((a, b) => {
      const aStr = this.toString(a).toLowerCase();
      const bStr = this.toString(b).toLowerCase();
      return aStr < bStr ? -1 :
        aStr > bStr ? 1 : 0;
    });
  }

  private toString(x): string {
    return new Optional(x).map(el => el.toString()).getOrElse('');
  }
}
