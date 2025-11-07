import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { HttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
import { FlagModule } from '../common/flag';
import { FloorModule } from '../../common/floor';
import { HistoryService } from './history.service';
import { HistoryComponent } from './history.component';
import { HistoryLimitPipe } from './history-limit.pipe';
import { ToastModule } from 'nap-components/toast';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule.forRoot(),
        NgbModalModule,
        TreeviewModule.forRoot(),
        ToastModule.forRoot(),
        NumberFormatModule,
        FlagModule,
        FloorModule
    ],
    declarations: [
        HistoryComponent,
        HistoryLimitPipe
    ],
    entryComponents: [
        HistoryComponent
    ],
    providers: [
        HistoryService
    ]
})
export class HistoryModule { }
