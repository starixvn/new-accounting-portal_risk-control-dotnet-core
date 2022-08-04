import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NumericTextboxModule } from 'nap-components/numeric-textbox';
import { HttpModule } from 'nap-components/http';
import { NoteModule } from 'nap-components/note';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { ConfirmationModule } from 'nap-components/confirmation';
import { PaginationModule, PaginationConfig } from 'nap-components/pagination';
import { GridComponent } from './grid.component';
import { ExclamationModule } from '../../common/exclamation';
import { WinLimitTextboxModule } from '../../common/win-limit-textbox';
import { LossLimitTextboxModule } from '../../common/loss-limit-textbox';
import { GroupSettingModule } from '../../common/group-setting';

@Injectable()
export class CustomPaginationConfig extends PaginationConfig {
    pageSizes = [20, 50, 100, 200];
    itemsPerPage = 20;
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        ReactiveFormsModule,
        NumericTextboxModule,
        WinLimitTextboxModule,
        LossLimitTextboxModule,
        ExclamationModule,
        NgxPaginationModule,
        NgbModalModule,
        NoteModule,
        BreadcrumbModule,
        ConfirmationModule.forRoot(),
        NumberFormatModule,
        PaginationModule.forRoot(),
        GroupSettingModule.forRoot()
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
