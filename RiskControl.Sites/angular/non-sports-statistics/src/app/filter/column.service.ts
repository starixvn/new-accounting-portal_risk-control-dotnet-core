import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { Helper } from 'nap-components/helper';
import { Column, ReportType } from './filter.model';
import { FilterConfig } from './filter.config';

@Injectable()
export class ColumnService {
  private readonly ReportTypeGroup1 = [0, 1, 2, 3, 4, 6, 9];
  private readonly ReportTypeGroup2 = [5];
  private readonly ReportTypeGroup3 = [7, 8];
  getColumns(reportType: ReportType, isNormalMode: boolean): Column[] {
    const service = this.getService(reportType);
    return service.getColumns(isNormalMode);
  }

  buildColumnTreeViewItems(columns: Column[], selectedColumns: Column[]): TreeviewItem[] {
    let uncheckedColumns: Column[] = [];

    if (selectedColumns === null || selectedColumns.length === 0) {
      uncheckedColumns = [FilterConfig.gridColumns.totalWins, FilterConfig.gridColumns.totalRefund, FilterConfig.gridColumns.turnover];
    } else {
      uncheckedColumns = _.differenceWith(columns, selectedColumns, _.isEqual);
    }

    const treeviewItems: TreeviewItem[] = [];
    columns.forEach(column => {
      const treeviewItem = new TreeviewItem({
        text: column.text,
        value: column,
        checked: !Helper.inArray(uncheckedColumns, column)
      });
      treeviewItems.push(treeviewItem);
    });

    return treeviewItems;
  }

  generateTreeItems(columns: Column[]): TreeviewItem[] {
    const uncheckedColumns = [FilterConfig.gridColumns.totalWins, FilterConfig.gridColumns.totalRefund, FilterConfig.gridColumns.turnover];
    const treeviewItems: TreeviewItem[] = [];
    columns.forEach(column => {
      const treeviewItem = new TreeviewItem({
        text: column.text,
        value: column.value,
        checked: !Helper.inArray(uncheckedColumns, column)
      });
      treeviewItems.push(treeviewItem);
    });

    return treeviewItems;
  }

  private getService(reportType: ReportType): BaseService {
    if (this.ReportTypeGroup1.includes(reportType)) {
      // tslint:disable-next-line: no-use-before-declare
      return new Group1Service();
    }

    if (this.ReportTypeGroup2.includes(reportType)) {
      // tslint:disable-next-line: no-use-before-declare
      return new Group2Service();
    }

    if (this.ReportTypeGroup3.includes(reportType)) {
      // tslint:disable-next-line: no-use-before-declare
      return new Group3Service();
    }

    // tslint:disable-next-line: no-use-before-declare
    return new Group4Service();
  }
}

interface BaseService {
  getColumns(isNormalMode: boolean): Column[];
}

class Group1Service implements BaseService {
  getColumns(isNormalMode: boolean): Column[] {
    const columns: Column[] = [
      FilterConfig.gridColumns.playerCount,
      FilterConfig.gridColumns.betCount,
      FilterConfig.gridColumns.currency,
      FilterConfig.gridColumns.totalBets,
      FilterConfig.gridColumns.totalWins,
      FilterConfig.gridColumns.gameIncome,
      FilterConfig.gridColumns.gamePayout,
      FilterConfig.gridColumns.totalRefund,
      FilterConfig.gridColumns.turnover,
      FilterConfig.gridColumns.realTurnover,
      FilterConfig.gridColumns.grossIncome,
      FilterConfig.gridColumns.commission,
      FilterConfig.gridColumns.extraPT,
      FilterConfig.gridColumns.netIncome
    ];

    return columns;
  }
}

class Group2Service implements BaseService {
  getColumns(): Column[] {
    const columns: Column[] = [
      FilterConfig.gridColumns.playerCount,
      FilterConfig.gridColumns.betCount,
      FilterConfig.gridColumns.totalBets,
      FilterConfig.gridColumns.totalWins,
      FilterConfig.gridColumns.gameIncome,
      FilterConfig.gridColumns.gamePayout,
      FilterConfig.gridColumns.totalRefund,
      FilterConfig.gridColumns.turnover,
      FilterConfig.gridColumns.realTurnover,
      FilterConfig.gridColumns.grossIncome,
      FilterConfig.gridColumns.commission,
      FilterConfig.gridColumns.extraPT,
      FilterConfig.gridColumns.netIncome
    ];

    return columns;
  }
}

class Group3Service implements BaseService {
  getColumns(isNormalMode: boolean): Column[] {
    let columns: Column[];
    if (isNormalMode) {
      columns = [
        FilterConfig.gridColumns.custId,
        FilterConfig.gridColumns.betCount,
        FilterConfig.gridColumns.currency,
        FilterConfig.gridColumns.totalBets,
        FilterConfig.gridColumns.totalWins,
        FilterConfig.gridColumns.gameIncome,
        FilterConfig.gridColumns.gamePayout,
        FilterConfig.gridColumns.totalRefund,
        FilterConfig.gridColumns.turnover,
        FilterConfig.gridColumns.realTurnover,
        FilterConfig.gridColumns.grossIncome,
        FilterConfig.gridColumns.commission,
        FilterConfig.gridColumns.extraPT,
        FilterConfig.gridColumns.netIncome,
        FilterConfig.gridColumns.housePositionTaking,
        FilterConfig.gridColumns.associatedAccount
      ];
    } else {
      columns = [
        FilterConfig.gridColumns.custId,
        FilterConfig.gridColumns.betCount,
        FilterConfig.gridColumns.currency,
        FilterConfig.gridColumns.totalBets,
        FilterConfig.gridColumns.totalWins,
        FilterConfig.gridColumns.gameIncome,
        FilterConfig.gridColumns.gamePayout,
        FilterConfig.gridColumns.totalRefund,
        FilterConfig.gridColumns.turnover,
        FilterConfig.gridColumns.realTurnover,
        FilterConfig.gridColumns.grossIncome,
        FilterConfig.gridColumns.commission,
        FilterConfig.gridColumns.extraPT,
        FilterConfig.gridColumns.netIncome,
        FilterConfig.gridColumns.associatedAccount
      ];
    }

    return columns;
  }
}

class Group4Service implements BaseService {
  getColumns(isNormalMode: boolean): Column[] {
    const columns: Column[] = [
      FilterConfig.gridColumns.betCount,
      FilterConfig.gridColumns.currency,
      FilterConfig.gridColumns.totalBets,
      FilterConfig.gridColumns.totalWins,
      FilterConfig.gridColumns.gameIncome,
      FilterConfig.gridColumns.gamePayout,
      FilterConfig.gridColumns.totalRefund,
      FilterConfig.gridColumns.turnover,
      FilterConfig.gridColumns.realTurnover,
      FilterConfig.gridColumns.grossIncome,
      FilterConfig.gridColumns.commission,
      FilterConfig.gridColumns.extraPT,
      FilterConfig.gridColumns.netIncome
    ];

    return columns;
  }
}
