import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from 'nap-components/http';
import { ToastModule } from 'nap-components/toast';
import { NoteModule } from 'nap-components/note';
import { ConfirmationModule } from 'nap-components/confirmation';
import { DropdownTypeaheadModule } from 'nap-components/dropdown-typeahead';
import { EditableWinLimitModule } from '../../common/editable-win-limit';
import { EditableLossLimitModule } from '../../common/editable-loss-limit';
import { ExclamationModule } from '../../common/exclamation';
import { InsertService } from './insert.service';
import { InsertComponent } from './insert.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        NgbModalModule,
        HttpModule.forRoot(),
        ToastModule.forRoot(),
        NoteModule,
        ConfirmationModule.forRoot(),
        DropdownTypeaheadModule,
        EditableWinLimitModule,
        EditableLossLimitModule,
        ExclamationModule
    ],
    declarations: [
        InsertComponent
    ],
    entryComponents: [
        InsertComponent
    ],
    exports: [
        InsertComponent
    ],
    providers: [
        InsertService
    ]
})
export class InsertModule { }
