import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumericTextboxModule } from 'ngx-numeric-textbox';
import { WinLimitTextboxComponent } from './win-limit-textbox.component';
import { WinLimitValidatorDirective } from './win-limit-validator.directive';
import { ExclamationModule } from '../exclamation';

@NgModule({
    imports: [
        FormsModule,
        NumericTextboxModule,
        ExclamationModule
    ],
    declarations: [
        WinLimitTextboxComponent,
        WinLimitValidatorDirective
    ],
    exports: [
        WinLimitTextboxComponent,
        WinLimitValidatorDirective
    ]
})
export class WinLimitTextboxModule { }
