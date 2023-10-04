import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumericTextboxModule } from 'nap-components/numeric-textbox';
import { LossLimitTextboxComponent } from './loss-limit-textbox.component';
import { LossLimitValidatorDirective } from './loss-limit-validator.directive';
import { ExclamationModule } from '../exclamation';

@NgModule({
    imports: [
        FormsModule,
        NumericTextboxModule,
        ExclamationModule
    ],
    declarations: [
        LossLimitTextboxComponent,
        LossLimitValidatorDirective
    ],
    exports: [
        LossLimitTextboxComponent,
        LossLimitValidatorDirective
    ]
})
export class LossLimitTextboxModule { }
