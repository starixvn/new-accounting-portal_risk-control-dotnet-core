import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from 'nap-components/http';
import { AccountService } from './account.service';
import { AccountComponent } from './account.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule.forRoot(),
        NgbModalModule.forRoot()
    ],
    declarations: [
        AccountComponent
    ],
    entryComponents: [
        AccountComponent
    ],
    providers: [
        AccountService
    ]
})
export class AccountModule { }
