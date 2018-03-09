import { BaseInput } from 'ionic-angular/util/base-input';
import { Component } from '@angular/core';
import { Config, Form, Item } from 'ionic-angular';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'continuous-range',
  templateUrl: 'continuous-range.html'
})
export class ContinuousRangeComponent extends BaseInput<number> implements ControlValueAccessor {

  readonly resolution = 100;

  private callbacks = [];

  _valueInternal: number;

  get valueInternal(): number {
    return this._valueInternal;
  }

  set valueInternal(newValue: number) {
    this._valueInternal = newValue;

    this.callbacks.forEach(cb => cb(newValue / this.resolution));
  }

  get value(): number {
    return this.valueInternal / this.resolution;
  }

  set value(newValue: number) {
    this.valueInternal = newValue * this.resolution;
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, _form: Form, _item: Item, _ngControl: NgControl) {
    super(config, elementRef, renderer, 'continuous-range', 0, _form, _item, _ngControl);
  }

  registerOnChange(callback: any): void {
    this.callbacks.push(callback);
  }

  writeValue(val: number): void {
    this.value = val;
  }
}
