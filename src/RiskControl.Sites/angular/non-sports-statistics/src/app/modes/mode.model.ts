import { ElementRef } from '@angular/core';
import { CompanyComponent } from './company';
import { CurrencyComponent } from './currency';
import { DailyComponent } from './daily';
import { DeviceComponent } from './device';
import { HourlyComponent } from './hourly';
import { MonthlyComponent } from './monthly';
import { ProductComponent } from './product';
import { Top20Component } from './top20';
import { UserNameComponent } from './user-name';

export interface ModeGenerate {
  onAfterGenerate(grid: ElementRef): void;
  generateTitle(isLast: boolean): string;
}

export interface RowAttribute {
  groupId: string;
  groupName: string;
}

export class GridModel {
  readonly isDrillDownCurrency: boolean;

  constructor(isDrillDownCurrency: boolean) {
    this.isDrillDownCurrency = isDrillDownCurrency;
  }
}
