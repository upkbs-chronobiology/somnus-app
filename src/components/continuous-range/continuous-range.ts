import { BaseInput } from 'ionic-angular/util/base-input';
import { cast } from '../../util/shenanigans';
import { Component, ElementRef, Input, Renderer } from '@angular/core';
import { Config, Form, Item } from 'ionic-angular';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'continuous-range',
  templateUrl: 'continuous-range.html'
})
export class ContinuousRangeComponent extends BaseInput<number> implements ControlValueAccessor {

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

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, _form: Form, _item: Item, _ngControl: NgControl) {
    super(cast(config), elementRef, renderer, 'continuous-range', 0, cast(_form), cast(_item), _ngControl);
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
