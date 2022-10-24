import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NumberFormatModule } from 'nap-components/number-format';
import { WinLimitTextboxModule } from '../win-limit-textbox';
import { EditableWinLimitComponent } from './editable-win-limit.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NumberFormatModule,
        WinLimitTextboxModule
    ],
    declarations: [
        EditableWinLimitComponent
    ],
    exports: [
        EditableWinLimitComponent,
        WinLimitTextboxModule
    ]
})
export class EditableWinLimitModule { }
