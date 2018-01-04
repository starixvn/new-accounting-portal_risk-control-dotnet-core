import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { NumericTextboxComponent } from 'ngx-numeric-textbox';

@Component({
    selector: 'nap-win-limit-textbox',
    templateUrl: './win-limit-textbox.component.html',
    styleUrls: ['./win-limit-textbox.component.scss']
})
export class WinLimitTextboxComponent implements OnChanges {
    @ViewChild(NumericTextboxComponent) numericTextboxComponent: NumericTextboxComponent;
    @Input() value: number;
    @Input() disabled: boolean;
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
