import { Injectable, Type } from '@angular/core';
import { ModeGenerate } from './mode.model';
import * as _ from 'lodash';
import { DailyComponent } from './daily';
import { ReportType } from '../filter/filter.model';
import { SportComponent } from './sport';
import { HourlyComponent } from './hourly';
import { MonthlyComponent } from './monthly';
import { CompanyComponent } from './company';
import { Top20Component } from './top20';
import { UserNameComponent } from './user-name';

@Injectable()
export class ModeService {
  private readonly componentListItems = [
    { reportType: ReportType.Daily, componentName: DailyComponent },
    { reportType: ReportType.Monthly, componentName: MonthlyComponent },
    { reportType: ReportType.Sport, componentName: SportComponent },
    { reportType: ReportType.League, componentName: SportComponent },
    { reportType: ReportType.BetType, componentName: SportComponent },
    { reportType: ReportType.Hourly, componentName: HourlyComponent },
    { reportType: ReportType.Company, componentName: CompanyComponent },
    { reportType: ReportType.Top20, componentName: Top20Component },
    { reportType: ReportType.UserName, componentName: UserNameComponent }
  ];
  getComponent(reportType: ReportType): Type<ModeGenerate> {
    const component = _.find(this.componentListItems, function (componentItem) {
      return componentItem.reportType === reportType;
    });

    return component!.componentName;
  }
}
