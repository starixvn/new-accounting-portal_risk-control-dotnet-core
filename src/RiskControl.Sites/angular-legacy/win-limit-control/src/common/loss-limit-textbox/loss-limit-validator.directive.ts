import { Directive, ContentChild, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { LossLimitTextboxComponent } from './loss-limit-textbox.component';
import { ExclamationComponent } from '../exclamation';

@Directive({
    selector: '[napLossLimitValidator]',
    exportAs: 'napLossLimitValidator'
})
export class LossLimitValidatorDirective implements AfterContentInit, AfterViewInit {
    @ContentChild('blackExclamation') blackExclamationComponent: ExclamationComponent;
    @ContentChild('greyExclamation') greyExclamationComponent: ExclamationComponent;
    @ContentChild('blackLossLimitTextbox') blackLossLimitTextboxComponent: LossLimitTextboxComponent;
    @ContentChild('greyLossLimitTextbox') greyLossLimitTextboxComponent: LossLimitTextboxComponent;
    private lossLimitTextboxComponents: LossLimitTextboxComponent[];
    private exclamationComponents: ExclamationComponent[];
    private invalidIndex = -1;

    get isValid(): boolean {
        return this.invalidIndex === -1;
    }

    ngAfterContentInit() {
        this.lossLimitTextboxComponents = [
            this.blackLossLimitTextboxComponent,
            this.greyLossLimitTextboxComponent
        ];
        for (const component of this.lossLimitTextboxComponents) {
            if (_.isNil(component)) {
                throw new Error('Missing LossLimitTextboxComponent');
            }
        }

        this.exclamationComponents = [
            this.blackExclamationComponent,
            this.greyExclamationComponent
        ];
        for (const component of this.exclamationComponents) {
            if (_.isNil(component)) {
                throw new Error('Missing ExclamationComponent');
            }
        }
    }

    ngAfterViewInit() {
        this.lossLimitTextboxComponents.forEach((component, index) => {
            component.valueChange.subscribe(() => this.validate(index));
        });
    }

    validate(index: number) {
        if (this.invalidIndex !== -1) {
            this.handleMessage(null, true);
            this.invalidIndex = -1;
        }

        const blackValue = this.blackLossLimitTextboxComponent.value;
        const greyValue = this.greyLossLimitTextboxComponent.value;
        let invalidMessage = '';

        if (!_.isNil(greyValue) && greyValue !== 0) {
            if (!_.isNil(blackValue) && blackValue !== 0 && greyValue <= blackValue) {
                this.invalidIndex = 1;
                invalidMessage = 'Grey limit must be greater than black limit';
                if (index === this.invalidIndex) {
                    this.handleMessage(invalidMessage, false);
                    return;
                }
            }
        }

        if (!_.isNil(blackValue) && blackValue !== 0) {
            if (!_.isNil(greyValue) && greyValue !== 0 && blackValue >= greyValue) {
                this.invalidIndex = 0;
                invalidMessage = 'Black limit must be less than grey limit';
                if (index === this.invalidIndex) {
                    this.handleMessage(invalidMessage, false);
                    return;
                }
            }
        }

        if (this.invalidIndex !== -1) {
            this.handleMessage(invalidMessage, false);
        }
    }

    focusInvalid() {
        this.lossLimitTextboxComponents[this.invalidIndex].focus();
    }

    private handleMessage(content: string, isValid: boolean) {
        this.lossLimitTextboxComponents[this.invalidIndex].invalid = !isValid;
        this.exclamationComponents[this.invalidIndex].title = content;
    }

    private setElementText(elementRef: ElementRef, content: string) {
        elementRef.nativeElement.textContent = content;
    }
}
