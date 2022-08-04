import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { NoteModule } from 'nap-components/note';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { ConfirmationModule } from 'nap-components/confirmation';
import { PaginationModule, PaginationConfig } from 'nap-components/pagination';
import { GroupSettingModule } from '../../common/group-setting';
import { EditableWinLimitModule } from '../../common/editable-win-limit';
import { EditableLossLimitModule } from '../../common/editable-loss-limit';
import { ExclamationModule } from '../../common/exclamation';
import { InsertModule } from '../insert';
import { GridComponent } from './grid.component';

@Injectable()
export class CustomPaginationConfig extends PaginationConfig {
    pageSizes = [20, 50, 100, 200];
    itemsPerPage = 20;
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NoteModule,
        HttpModule.forRoot(),
        BreadcrumbModule,
        ConfirmationModule.forRoot(),
        PaginationModule.forRoot(),
        GroupSettingModule.forRoot(),
        EditableWinLimitModule,
        EditableLossLimitModule,
        ExclamationModule,
        InsertModule
    ],
    declarations: [
        GridComponent
    ],
    exports: [
        GridComponent
    ],
    providers: [
        { provide: PaginationConfig, useClass: CustomPaginationConfig }
    ]
})
export class GridModule { }
