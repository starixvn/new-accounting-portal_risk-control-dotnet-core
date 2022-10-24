import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { NumericTextboxComponent } from 'nap-components/numeric-textbox';

@Component({
  selector: 'nap-loss-limit-textbox',
  templateUrl: './loss-limit-textbox.component.html',
  styleUrls: ['./loss-limit-textbox.component.scss']
})
export class LossLimitTextboxComponent implements OnChanges {
  @ViewChild(NumericTextboxComponent) numericTextboxComponent: NumericTextboxComponent;
  @Input() value: number;
  @Input() disabled: false;
  @Output() blur = new EventEmitter<number>();
  @Output() valueChange = new EventEmitter<number>();
  invalid = false;
  private emitted = false;

  ngOnChanges() {
    if (!this.emitted) {
      this.valueChange.emit(this.value);
    }

    this.emitted = false;
  }

  onModelChange(value: number) {
    this.emitted = true;
    this.valueChange.emit(value);
  }

  focus() {
    this.numericTextboxComponent.focusInput();
  }

  onBlur() {
    this.blur.emit();
  }
}
