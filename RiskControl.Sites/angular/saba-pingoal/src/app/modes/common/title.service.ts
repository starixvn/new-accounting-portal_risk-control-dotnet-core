import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { DATE_CONFIG } from '../../common';
import { ModeContext } from '../mode-context';

enum TitleDateFormat {
  FromTo,
  On
}

@Injectable()
export class TitleService {
  constructor(
    private readonly modeContext: ModeContext
  ) { }

  getBreadcrumbTitle(isLast: boolean): string {
    if (isLast) {
      return this.getTitle();
    } else {
      const label = this.modeContext.label;
      return label;
    }
  }

  getTitle(): string {
    const gridModel = this.modeContext.gridModel;
    const titleDateFormat = this.getTitleDateFormat();
    const dateString = this.getDateString(titleDateFormat, false);
    const currencyName = this.getCurrencyName();
    if (gridModel.isDrillDownCurrency) {
      return `Headline Game Statistics Report ${dateString} By Currency (${currencyName})`;
    } else {
      return `Headline Game Statistics Report ${dateString} (${currencyName})`;
    }
  }

  getExcelFileName(extension = 'xls'): string {
    const gridModel = this.modeContext.gridModel;
    const titleDateFormat = this.getTitleDateFormat();
    const dateString = this.getDateString(titleDateFormat, true);
    if (gridModel.isDrillDownCurrency) {
      return `Headline_Game_Statistics_Report_${dateString}_By_Currency.${extension}`;
    } else {
      return `Headline_Game_Statistics_Report_${dateString}.${extension}`;
    }
  }

  getGrandTotalByCurrencyTitle() {
    const titleDateFormat = this.getTitleDateFormat();
    const currencyName = this.getCurrencyName();
    const dateString = this.getDateString(titleDateFormat, false);
    return `Grand Total By Currency ${dateString} (${currencyName})`;
  }

  getExcelGrandTotalFileName() {
    const titleDateFormat = this.getTitleDateFormat();
    const dateString = this.getDateString(titleDateFormat, true);
    return `Grand_Total_By_Currency_${dateString}.xls`;
  }

  private getTitleDateFormat(): TitleDateFormat {
    return TitleDateFormat.FromTo;
  }

  private getCurrencyName() {
    const filterModel = this.modeContext.filterModel;
    if (filterModel.currency.length > 1) {
      return 'Original currency';
    } else {
      return '';
    }
    return '';
  }

  private getDateString(titleDateFormat: TitleDateFormat, isExcel: boolean): string {
    const filterModel = this.modeContext.filterModel;
    let formatString: string;
    let dateString: string;
    let result = '';
    switch (titleDateFormat) {
      case TitleDateFormat.On:
        formatString = isExcel ? DATE_CONFIG.dateFormatString2 : DATE_CONFIG.dateFormatString;
        dateString = filterModel.fromDate.format(formatString);
        result = isExcel ? `On_${dateString}` : `On ${dateString}`;
        break;
      case TitleDateFormat.FromTo:
        formatString = isExcel ? DATE_CONFIG.dateFormatString2 : DATE_CONFIG.dateFormatString;
        const startDateString = filterModel.fromDate.format(formatString);
        const endDateString = filterModel.toDate.format(formatString);
        result = isExcel ? `From_${startDateString}_To_${endDateString}` : `From ${startDateString} To ${endDateString}`;
        break;
      default:
        result = '';
        break;
    }

    return result;
  }
}
