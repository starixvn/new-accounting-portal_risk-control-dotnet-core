import { Directive, ContentChild, ContentChildren, QueryList, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { WinLimitTextboxComponent } from './win-limit-textbox.component';
import { ExclamationComponent } from '../exclamation';

@Directive({
    selector: '[napWinLimitValidator]',
    exportAs: 'napWinLimitValidator'
})
export class WinLimitValidatorDirective implements AfterContentInit, AfterViewInit {
    @ContentChild('orangeExclamation') orangeExclamationComponent: ExclamationComponent;
    @ContentChild('yellowExclamation') yellowExclamationComponent: ExclamationComponent;
    @ContentChild('redExclamation') redExclamationComponent: ExclamationComponent;
    @ContentChild('orangeWinLimitTextbox') orangleWinLimitTextboxComponent: WinLimitTextboxComponent;
    @ContentChild('yellowWinLimitTextbox') yellowWinLimitTextboxComponent: WinLimitTextboxComponent;
    @ContentChild('redWinLimitTextbox') redWinLimitTextboxComponent: WinLimitTextboxComponent;
    private winLimitTextboxComponents: WinLimitTextboxComponent[];
    private exclamationComponents: ExclamationComponent[];
    private invalidIndex = -1;

    get isValid(): boolean {
        return this.invalidIndex === -1;
    }

    ngAfterContentInit() {
        this.winLimitTextboxComponents = [
            this.orangleWinLimitTextboxComponent,
            this.yellowWinLimitTextboxComponent,
            this.redWinLimitTextboxComponent
        ];
        for (const component of this.winLimitTextboxComponents) {
            if (_.isNil(component)) {
                throw new Error('Missing WinLimitTextboxComponent');
            }
        }

        this.exclamationComponents = [
            this.orangeExclamationComponent,
            this.yellowExclamationComponent,
            this.redExclamationComponent
        ];
        for (const component of this.exclamationComponents) {
            if (_.isNil(component)) {
                throw new Error('Missing ExclamationComponent');
            }
        }
    }

    ngAfterViewInit() {
        this.winLimitTextboxComponents.forEach((component, index) => {
            component.valueChange.subscribe(() => this.validate(index));
        });
    }

    validate(index: number) {
        if (this.invalidIndex !== -1) {
            this.handleMessage('', true);
            this.invalidIndex = -1;
        }

        const orangeValue = this.orangleWinLimitTextboxComponent.value;
        const yellowValue = this.yellowWinLimitTextboxComponent.value;
        const redValue = this.redWinLimitTextboxComponent.value;
        let invalidMessage = '';

        if (!_.isNil(redValue) && redValue !== 0) {
            if (!_.isNil(yellowValue) && yellowValue !== 0 && redValue <= yellowValue) {
                this.invalidIndex = 2;
                invalidMessage = 'Red limit must be greater than yellow limit';
                if (index === this.invalidIndex) {
                    this.handleMessage(invalidMessage, false);
                    return;
                }
            }

            if (!_.isNil(orangeValue) && orangeValue !== 0 && redValue <= orangeValue) {
                this.invalidIndex = 2;
                invalidMessage = 'Red limit must be greater than orange limit';
                if (index === this.invalidIndex) {
                    this.handleMessage(invalidMessage, false);
                    return;
                }
            }
        }

        if (!_.isNil(yellowValue) && yellowValue !== 0) {
            if (!_.isNil(orangeValue) && orangeValue !== 0 && yellowValue <= orangeValue) {
                this.invalidIndex = 1;
                invalidMessage = 'Yellow limit must be greater than orange limit';
                if (index === this.invalidIndex) {
                    this.handleMessage(invalidMessage, false);
                    return;
                }
            }

            if (!_.isNil(redValue) && redValue !== 0 && yellowValue >= redValue) {
                this.invalidIndex = 1;
                invalidMessage = 'Yellow limit must be less than red limit';
                if (index === this.invalidIndex) {
                    this.handleMessage(invalidMessage, false);
                    return;
                }
            }
        }

        if (!_.isNil(orangeValue) && orangeValue !== 0) {
            if (!_.isNil(yellowValue) && yellowValue !== 0 && orangeValue >= yellowValue) {
                this.invalidIndex = 0;
                invalidMessage = 'Orange limit must be less than yellow limit';
                if (index === this.invalidIndex) {
                    this.handleMessage(invalidMessage, false);
                    return;
                }
            }

            if (!_.isNil(redValue) && redValue !== 0 && orangeValue >= redValue) {
                this.invalidIndex = 0;
                invalidMessage = 'Orange limit must be less than red limit';
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
        this.winLimitTextboxComponents[this.invalidIndex].focus();
    }

    private handleMessage(content: string, isValid: boolean) {
        this.winLimitTextboxComponents[this.invalidIndex].invalid = !isValid;
        this.exclamationComponents[this.invalidIndex].title = content;
    }

    private setElementText(elementRef: ElementRef, content: string) {
        elementRef.nativeElement.textContent = content;
    }
}
