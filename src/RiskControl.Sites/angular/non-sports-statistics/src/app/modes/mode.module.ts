import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { GridModule } from 'components/grid';
import { GridModalComponent } from 'components/grid-modal';
import { HourlyModule } from './hourly';
import { DailyModule } from './daily';
import { MonthlyModule } from './monthly';
import { CompanyModule } from './company';
import { CurrencyModule } from './currency';
import { ProductModule } from './product';
import { DeviceModule } from './device';
import { UserNameModule } from './user-name';
import { Top20Module } from './top20';
import { AssociatedAccountModule } from './associated-account';
import { HousePositionTakingModule } from './house-position-taking';
import { ModeService } from './mode.service';

@NgModule({
    imports: [
        BrowserModule,
        NumberFormatModule,
        BreadcrumbModule,
        GridModule,
        AssociatedAccountModule.forRoot(),
        HousePositionTakingModule.forRoot(),
        HourlyModule,
        DailyModule,
        MonthlyModule,
        CompanyModule,
        CurrencyModule,
        ProductModule,
        DeviceModule,
        UserNameModule,
        Top20Module
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
