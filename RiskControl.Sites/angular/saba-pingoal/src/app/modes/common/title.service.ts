import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { DATE_CONFIG } from '../../common';
import { FilterModelWrapper, ReportType} from '../../filter/filter.model';
import { FilterHelper } from '../../filter/filter-helper';
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
      const extraLabel = this.modeContext.extraLabel;
      if (_.isNil(extraLabel)) {
        return label;
      } else {
        return `${label} (${extraLabel})`;
      }
    }
  }

  getTitle(): string {
    const reportName = this.getReportName();
    return this.getTitleWithPrefix(reportName);
  }

  getTitleWithPrefix(prefix: string): string {
    const gridModel = this.modeContext.gridModel;
    const titleDateFormat = this.getTitleDateFormat();
    const dateString = this.getDateString(titleDateFormat, false);
    const currencyName = this.getCurrencyName();
    if (gridModel.isDrillDownCurrency) {
      return `${prefix} SABA PinGoal Report ${dateString} By Currency (${currencyName})`;
    } else {
      return `${prefix} SABA PinGoal Report ${dateString} (${currencyName})`;
    }
  }

  getExcelFileName(extension = 'xls'): string {
    const gridModel = this.modeContext.gridModel;
    const reportName = this.getReportName().replace(/ /g, '_');
    const titleDateFormat = this.getTitleDateFormat();
    const dateString = this.getDateString(titleDateFormat, true);
    if (gridModel.isDrillDownCurrency) {
      return `${reportName}_SABA_PinGoal_Report_${dateString}_By_Currency.${extension}`;
    } else {
      return `${reportName}_SABA_PinGoal_Report_${dateString}.${extension}`;
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

  private getReportName(): string {
    const filterModel = this.modeContext.filterModel;
    switch (filterModel.reportType) {
      case ReportType.Daily:
        return ReportType[ReportType.Daily];
      case ReportType.Sport:
        return ReportType[ReportType.Sport];
      case ReportType.League:
        return ReportType[ReportType.Sport];
      case ReportType.BetType:
        return ReportType[ReportType.Sport];
      case ReportType.Monthly:
        return ReportType[ReportType.Monthly];
      case ReportType.Company:
        return ReportType[ReportType.Company];
      default:
          return ReportType[ReportType.Daily];
    }
  }

  private getTitleDateFormat(): TitleDateFormat {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel;
    if (filterModel.reportType === ReportType.Hourly || 
      (filterModel.reportType === ReportType.Daily && gridModel.isDrillDownCurrency)) {
      return TitleDateFormat.On;
    }

    return TitleDateFormat.FromTo;
  }

  private getCurrencyName() {
    const filterModel = this.modeContext.filterModel;
    if (filterModel.currency.split(',').length > 1) {
      return 'Original currency';
    } else {
      const filterModelWrapper = new FilterModelWrapper(filterModel);
      return filterModelWrapper.getCurrencyName(parseInt(filterModel.currency));
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
