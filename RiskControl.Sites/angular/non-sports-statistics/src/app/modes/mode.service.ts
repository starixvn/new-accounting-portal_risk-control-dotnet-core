import { Injectable, Type } from '@angular/core';
import { HourlyComponent } from './hourly/hourly.component';
import { DailyComponent } from './daily/daily.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { CompanyComponent } from './company/company.component';
import { CurrencyComponent } from './currency/currency.component';
import { ProductComponent } from './product/product.component';
import { DeviceComponent } from './device/device.component';
import { UserNameComponent } from './user-name/user-name.component';
import { Top20Component } from './top20/top20.component';
import { ReportType } from 'app/filter/filter.model';
import { ModeGenerate } from './mode.model';
import * as _ from 'lodash';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@Injectable()
export class ModeService {

  private readonly componentListItems = [
    { reportType: ReportType.Hourly, componentName: HourlyComponent },
    { reportType: ReportType.Daily, componentName: DailyComponent },
    { reportType: ReportType.Monthly, componentName: MonthlyComponent },
    { reportType: ReportType.Company, componentName: CompanyComponent },
    { reportType: ReportType.Currency, componentName: CurrencyComponent },
    { reportType: ReportType.Product, componentName: ProductComponent },
    { reportType: ReportType.Device, componentName: DeviceComponent },
    { reportType: ReportType.UserName, componentName: UserNameComponent },
    { reportType: ReportType.Top20, componentName: Top20Component },
    { reportType: ReportType.ProductDetail, componentName: ProductDetailComponent }
  ];
  getComponent(reportType: ReportType): Type<ModeGenerate> {
    const component = _.find(this.componentListItems, function (componentItem) {
      return componentItem.reportType === reportType;
    });

    return component.componentName;
  }
}
