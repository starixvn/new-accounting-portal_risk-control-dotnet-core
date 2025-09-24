import { Injectable, Type } from '@angular/core';
import { ModeGenerate } from './mode.model';
import * as _ from 'lodash';
import { DailyComponent } from './daily';
import { ReportType } from '../filter/filter.model';
import { ProductComponent } from './product';
import { HourlyComponent } from './hourly';

@Injectable()
export class ModeService {
  private readonly componentListItems = [
    { reportType: ReportType.Daily, componentName: DailyComponent },
    { reportType: ReportType.Product, componentName: ProductComponent },
    { reportType: ReportType.Hourly, componentName: HourlyComponent }
  ];
  getComponent(reportType: ReportType): Type<ModeGenerate> {
    const component = _.find(this.componentListItems, function (componentItem) {
      return componentItem.reportType === reportType;
    });

    return component!.componentName;
  }
}
