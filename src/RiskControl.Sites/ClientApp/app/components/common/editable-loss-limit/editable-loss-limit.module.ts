import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NumberFormatModule } from 'nap-components/number-format';
import { LossLimitTextboxModule } from '../loss-limit-textbox';
import { EditableLossLimitComponent } from './editable-loss-limit.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NumberFormatModule,
        LossLimitTextboxModule
    ],
    declarations: [
        EditableLossLimitComponent
    ],
    exports: [
        EditableLossLimitComponent,
        LossLimitTextboxModule
    ]
})
export class EditableLossLimitModule { }
