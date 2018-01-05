import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeviewItem } from 'ngx-treeview';
import { TableColumn, ColumnHelper } from '../common/column';
import { HistoryModel, Columns } from './history.model';

const scrollWidth = 20;

@Component({
  selector: 'nap-history',
  templateUrl: './history.component.html',
  styleUrls: [
    './history.component.scss'
  ]
})
export class HistoryComponent {
  historyModels: HistoryModel[];
  username: string;
  productName: string;
  columns = Columns;
  columnTreeviewItems = ColumnHelper.createColumnTreeviewItems(this.columns);
  width = scrollWidth;
  colspan: number;
  rowspan: number;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  onColumnChange(selectedColumns: TableColumn[]) {
    ColumnHelper.updateCheckedBySelection(Columns, selectedColumns);
    this.calculateRowspanColspanAndWidth();
  }

  show(historyModels: HistoryModel[], username: string, productName: string) {
    this.historyModels = historyModels;
    this.username = username;
    this.productName = productName;
  }

  private calculateRowspanColspanAndWidth() {
    this.rowspan = this.columns.winLimitLevel.checked || this.columns.lossLimitLevel.checked ? 2 : 1;
    this.colspan = 0;
    this.width = scrollWidth;
    for (const columnName in this.columns) {
      if (this.columns.hasOwnProperty(columnName)) {
        const column: TableColumn = this.columns[columnName];
        if (column.checked) {
          if (column === this.columns.lossLimitLevel) {
            this.colspan += 2;
          } else if (column === this.columns.winLimitLevel) {
            this.colspan += 3;
          } else {
            this.colspan += 1;
          }
          this.width += column.width;
        }
      }
    }
  }
}
