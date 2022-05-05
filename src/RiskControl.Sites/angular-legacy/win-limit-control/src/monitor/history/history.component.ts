import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'nap-components/confirmation';
import { TreeviewItem } from 'ngx-treeview';
import { TableColumn, ColumnHelper } from '../common/column';
import { GridService } from '../grid/grid.service';
import { HistoryModel, Columns } from './history.model';

const scrollWidth = 20;

@Component({
  selector: 'nap-history',
  templateUrl: './history.component.html',
  styleUrls: [
    './history.component.scss'
  ],
  providers: [
    GridService
  ]
})
export class HistoryComponent {
  historyModels: HistoryModel[];
  username: string;
  productName: string;
  custId: number;
  columns = Columns;
  columnTreeviewItems = ColumnHelper.createColumnTreeviewItems(this.columns);
  width = scrollWidth;
  colspan: number;
  rowspan: number;
  hasHostPermission: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private confirmationService: ConfirmationService,
    private gridService: GridService
  ) { }

  onColumnChange(selectedColumns: TableColumn[]) {
    ColumnHelper.updateCheckedBySelection(Columns, selectedColumns);
    this.calculateRowspanColspanAndWidth();
  }

  show(historyModels: HistoryModel[], username: string, productName: string, custId: number, hasHostPermission: boolean) {
    this.historyModels = historyModels;
    this.username = username;
    this.productName = productName;
    this.custId = custId;
    this.hasHostPermission = hasHostPermission;
    this.columns.isNotified.checked = hasHostPermission;
    this.columns.logID.checked = hasHostPermission;
  }

  onUncheckNotification(historyModel: HistoryModel) {
    this.confirmationService.openContent(
        'Are you sure you want to uncheck? Click "OK" to convert IsNotified from 1 to 0',
        () => this.internalUnCheckNotification(historyModel),
        () => historyModel.IsNotified = true
    );
    return false;
  }

  private internalUnCheckNotification(historyModel: HistoryModel) {
    this.gridService.unCheckNotification(historyModel.LogID, this.custId).subscribe(commandResult => {
        historyModel.IsNotified = commandResult.ErrorCode !== 0;
    });
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
