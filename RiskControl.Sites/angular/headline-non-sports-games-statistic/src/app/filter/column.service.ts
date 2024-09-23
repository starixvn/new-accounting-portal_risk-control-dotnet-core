import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { Column } from './filter.model';
import { FilterConfig } from './filter.config';

@Injectable()
export class ColumnService {
  getColumns(): Column[] {
    const columns: Column[] = [
      FilterConfig.gridColumns.user,
      FilterConfig.gridColumns.custId,
      FilterConfig.gridColumns.betCount,
      FilterConfig.gridColumns.currency,
      FilterConfig.gridColumns.totalBets,
      FilterConfig.gridColumns.gameIncome,
      FilterConfig.gridColumns.gamePayout,
      FilterConfig.gridColumns.realTurnover,
      FilterConfig.gridColumns.grossIncome,
      FilterConfig.gridColumns.commission,
      FilterConfig.gridColumns.extraPT,
      FilterConfig.gridColumns.netIncome
    ];

    return columns;
  }

  buildColumnTreeViewItems(columns: Column[], selectedColumns: Column[]): TreeviewItem[] {
    const treeviewItems: TreeviewItem[] = [];
    columns.forEach(column => {
      const treeviewItem = new TreeviewItem({
        text: column.text,
        value: column,
        checked: true
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
