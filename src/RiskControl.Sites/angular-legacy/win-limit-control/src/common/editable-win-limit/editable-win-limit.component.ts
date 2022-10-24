// @ts-nocheck
import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { WinLimitTextboxComponent } from '../win-limit-textbox';

@Component({
    selector: 'nap-editable-win-limit',
    templateUrl: './editable-win-limit.component.html'
})
export class EditableWinLimitComponent extends WinLimitTextboxComponent implements AfterViewInit {
    @Input() editable = true;
    @ViewChild('winLimitTextbox') winLimitTextbox: WinLimitTextboxComponent;
    @Output() edit = new EventEmitter();
    @Output() complete = new EventEmitter<number>();
    isEdit = false;
    private isEmitted = false;

    set invalid(value: boolean) {
        if (this.winLimitTextbox) {
            this.winLimitTextbox.invalid = value;
        }
    }

    get invalid(): boolean {
        return this.winLimitTextbox ? this.winLimitTextbox.invalid : false;
    }

    ngAfterViewInit() {
        this.winLimitTextbox.numericTextboxComponent.enter.subscribe(() => this.onEnter());
        this.winLimitTextbox.numericTextboxComponent.escape.subscribe(() => this.onEscape());
    }

    openEdit() {
        if (!this.editable) {
            return;
        }

        this.isEdit = true;
        setTimeout(() => {
            this.winLimitTextbox.numericTextboxComponent.focusInput();
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
            this.winLimitTextbox.numericTextboxComponent.blurInput();
        }
    }

    private onEscape() {
        this.isEmitted = true;
        this.complete.emit();
        this.winLimitTextbox.numericTextboxComponent.blurInput();
    }
}
