import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpModule } from 'nap-components/http';
import { NoteModule } from 'nap-components/note';
import { CountdownTimerModule } from 'nap-components/countdown-timer';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { ConfirmationModule } from 'nap-components/confirmation';
import { PaginationModule, PaginationConfig } from 'nap-components/pagination';
import { FloorModule } from '../../common/floor';
import { ReachedLimitCountModule } from '../common/reached-limit-count';
import { FlagModule } from '../common/flag';
import { AccountModule } from '../account';
import { HistoryModule } from '../history';
import { HighlightDirective } from './highlight.directive';
import { GridComponent } from './grid.component';

@Injectable()
export class CustomPaginationConfig extends PaginationConfig {
    pageSizes = [50, 100, 200, 300, 500];
    itemsPerPage = 50;
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        NoteModule,
        BreadcrumbModule,
        NgxPaginationModule,
        ConfirmationModule.forRoot(),
        NumberFormatModule,
        CountdownTimerModule,
        PaginationModule.forRoot(),
        HistoryModule,
        AccountModule,
        FlagModule,
        ReachedLimitCountModule,
        FloorModule
    ],
    declarations: [
        GridComponent,
        HighlightDirective
    ],
    exports: [
        GridComponent
    ],
    providers: [
        { provide: PaginationConfig, useClass: CustomPaginationConfig }
    ]
})
export class GridModule { }
