import { Injectable, Type } from '@angular/core';
import { ReportType } from 'app/filter/filter.model';
import { ModeGenerate } from './mode.model';
import * as _ from 'lodash';

@Injectable()
export class ModeService {

  private readonly componentListItems = [
  ];
  getComponent(reportType: ReportType): Type<ModeGenerate> {
    // const component = _.find(this.componentListItems, function (componentItem) {
    //   return componentItem.reportType === reportType;
    // });

    // return component.componentName;
  }
}
