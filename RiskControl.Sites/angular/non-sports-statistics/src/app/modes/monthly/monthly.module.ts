import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { MonthlyComponent } from './monthly.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule.forRoot(),
        ModalModule.forRoot(),
        GridModule
    ],
    exports: [
        MonthlyComponent
    ],
    declarations: [
        MonthlyComponent
    ],
    entryComponents: [
        MonthlyComponent
    ],
    providers: []
})
export class MonthlyModule { }
