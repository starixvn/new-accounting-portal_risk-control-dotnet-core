import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { GridModule } from 'components/grid';
import { GridModalComponent } from 'components/grid-modal';
import { ModeService } from './mode.service';;
import { DailyComponent } from './daily';

@NgModule({
    imports: [
        BrowserModule,
        NumberFormatModule,
        BreadcrumbModule,
        GridModule
    ],
    declarations: [
        GridModalComponent
    ],
    entryComponents: [
        GridModalComponent
    ],
    providers: [
        ModeService
    ]
})
export class ModeModule { }
