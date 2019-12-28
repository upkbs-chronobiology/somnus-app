// import { BaseInput } from 'ionic-angular/util/base-input'; // FIXME: UMD or not, ffs?
// import { BaseInput } from 'ionic-angular/umd/util/base-input'; // FIXME: UMD or not, ffs?
// import { BaseInput as bi } from 'ionic-angular/umd/util/base-input'; // FIXME: UMD or not, ffs?
// import { BaseInput } from '../../../node_modules/ionic-angular/util/base-input'; // FIXME: UMD or not, ffs?
import { Range, Haptic, Platform, DomController, Ion } from 'ionic-angular'; // FIXME: UMD or not, ffs?
import { cast } from '../../util/shenanigans';
import { Component, ElementRef, Input, Renderer, ChangeDetectorRef, forwardRef } from '@angular/core';
import { Config, Form, Item } from 'ionic-angular';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { NumberValueAccessor } from '@angular/forms';

// export const NUMBER_VALUE_ACCESSOR = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => NumberValueAccessor),
//   multi: true
// };

@Component({
  selector: 'continuous-range',
  templateUrl: 'continuous-range.html',
  // providers: [NUMBER_VALUE_ACCESSOR]
})
// FIXME: Should actually extend BaseInput<number>, but that one's causing problems with AOT (or JIT).
export class ContinuousRangeComponent implements ControlValueAccessor { // extends BaseInput<number>
  registerOnTouched(fn: any): void {
    // TODO: implement
  }
  setDisabledState?(isDisabled: boolean): void {
    // TODO: implement
  }

  readonly resolution = 100;

  private callbacks = [];

  @Input()
  min: number = 0;

  @Input()
  max: number = 1;

  _valueInternal: number;

  get valueInternal(): number {
    return this._valueInternal;
  }

  set valueInternal(newValue: number) {
    this._valueInternal = newValue;

    this.callbacks.forEach(cb => cb(this.value));
  }

  get value(): number {
    return this.transformFromUnit(this.valueInternal / this.resolution);
  }

  set value(newValue: number) {
    this.valueInternal = this.transformToUnit(newValue) * this.resolution;
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, _form: Form, _item: Item, _ngControl: NgControl,
    _haptic: Haptic, _plt: Platform, _dom: DomController, _cd: ChangeDetectorRef) {
    // XXX: This would have been to super call for BaseInput
    // super(cast(config), elementRef, renderer, 'continuous-range', 0, cast(_form), cast(_item), _ngControl);
    // super(_form, _haptic, _item, cast(config), _plt, elementRef, renderer, _dom, _cd);
    // super(config, elementRef, renderer, 'continuous-range');
    if (_ngControl) {
      _ngControl.valueAccessor = this;
    }
  }

  registerOnChange(callback: any): void {
    this.callbacks.push(callback);
  }

  writeValue(val: number): void {
    this.value = val;
  }

  private transformToUnit(num: number): number {
    return (num - this.min) / (this.max - this.min);
  }

  private transformFromUnit(num: number): number {
    return num * (this.max - this.min) + this.min;
  }
}
