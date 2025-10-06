import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { HourlyComponent } from './hourly.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule.forRoot(),
        NumberFormatModule,
        BreadcrumbModule
    ],
    exports: [
        HourlyComponent
    ],
    declarations: [
        HourlyComponent
    ],
    entryComponents: [
        HourlyComponent
    ],
    providers: []
})
export class HourlyModule { }
