import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { LossLimitTextboxComponent } from '../loss-limit-textbox';

@Component({
    selector: 'nap-editable-loss-limit',
    templateUrl: './editable-loss-limit.component.html'
})
export class EditableLossLimitComponent extends LossLimitTextboxComponent implements OnInit {
    @Input() editable = true;
    @ViewChild('lossLimitTextbox') lossLimitTextbox: LossLimitTextboxComponent;
    @Output() edit = new EventEmitter();
    @Output() complete = new EventEmitter<number>();
    isEdit = false;
    private isEmitted = false;

    set invalid(value: boolean) {
        if (this.lossLimitTextbox) {
            this.lossLimitTextbox.invalid = value;
        }
    }

    get invalid(): boolean {
        return this.lossLimitTextbox ? this.lossLimitTextbox.invalid : false;
    }

    ngOnInit() {
        this.lossLimitTextbox.numericTextboxComponent.enter.subscribe(() => this.onEnter());
        this.lossLimitTextbox.numericTextboxComponent.escape.subscribe(() => this.onEscape());
    }

    openEdit() {
        if (!this.editable) {
            return;
        }

        this.isEdit = true;
        setTimeout(() => {
            this.lossLimitTextbox.numericTextboxComponent.focus();
        });
        this.edit.emit();
    }

    closeEdit() {
        this.isEdit = false;
    }

    onBlur() {
        if (!this.isEmitted) {
            this.complete.emit();
        }

        this.isEmitted = false;
    }

    private onEnter() {
        if (!_.isNil(this.value)) {
            this.isEmitted = true;
            this.complete.emit(this.value);
            this.lossLimitTextbox.numericTextboxComponent.blur();
        }
    }

    private onEscape() {
        this.isEmitted = true;
        this.complete.emit();
        this.lossLimitTextbox.numericTextboxComponent.blur();
    }
}
