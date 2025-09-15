import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { Column } from './filter.model';
import { FilterConfig } from './filter.config';
import { Helper } from 'nap-components/helper';
import * as _ from 'lodash';

@Injectable()
export class ColumnService {
  getColumns(): Column[] {
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

  buildColumnTreeViewItems(columns: Column[]): TreeviewItem[] {
    let uncheckedColumns: Column[] = [];

    uncheckedColumns = [FilterConfig.gridColumns.totalWins, FilterConfig.gridColumns.totalRefund, FilterConfig.gridColumns.turnover];

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
    const treeviewItems: TreeviewItem[] = [];
    columns.forEach(column => {
      const treeviewItem = new TreeviewItem({
        text: column.text,
        value: column.value,
        checked: true
      });
      treeviewItems.push(treeviewItem);
    });

    return treeviewItems;
  }
}
