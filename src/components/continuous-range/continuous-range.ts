import { Component, ElementRef, Input, Renderer } from '@angular/core';
import { Config, Ion } from 'ionic-angular';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'continuous-range',
  templateUrl: 'continuous-range.html'
})
export class ContinuousRangeComponent extends Ion implements ControlValueAccessor {

  readonly resolution = 100;

  private callbacks = [];

  @Input()
  min: number = 0;

  @Input()
  max: number = 1;

  disabled: boolean = false;

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

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, _ngControl: NgControl) {
    super(config, elementRef, renderer, 'continuous-range');

    // (see Ionic's BaseInput on why we need this)
    if (_ngControl) {
      _ngControl.valueAccessor = this;
    }
  }

  registerOnTouched(fn: any): void {
    // ignore for now
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
