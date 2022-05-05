import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid.component';
import { GridService } from './grid.service';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { CurrencyComponent } from './currency/currency.component';
import { DeviceComponent } from './device/device.component';
import { CompanyComponent } from './company/company.component';
import { DailyComponent } from './daily/daily.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { DeviceService } from './device/device.service';
import { DailyService } from './daily/daily.service';
import { MonthlyService } from './monthly/monthly.service';
import { CompanyService } from './company/company.service';
import { CurrencyService } from './currency/currency.service';
import { ProductComponent } from './product/product.component';
import { QueryModelService } from './../common/query-model.service';
import { ProductService } from './product/product.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NumberFormatModule,
        BreadcrumbModule
    ],
    declarations: [
        GridComponent,
        DailyComponent,
        MonthlyComponent,
        CompanyComponent,
        DeviceComponent,
        CurrencyComponent,
        ProductComponent
    ],
    exports: [
        GridComponent
    ],
    providers: [
        GridService,
        DailyService,
        MonthlyService,
        CompanyService,
        DeviceService,
        CurrencyService,
        QueryModelService,
        ProductService
    ]
})

export class GridModule { }
