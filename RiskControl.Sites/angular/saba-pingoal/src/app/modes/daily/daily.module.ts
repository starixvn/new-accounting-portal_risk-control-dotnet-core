import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { DailyComponent } from './daily.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule.forRoot(),
        ModalModule.forRoot(),
        GridModule
    ],
    exports: [
        DailyComponent
    ],
    declarations: [
        DailyComponent
    ],
    entryComponents: [
        DailyComponent
    ],
    providers: []
})
export class DailyModule { }
