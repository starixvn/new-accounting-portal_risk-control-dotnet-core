import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'nap-components/confirmation';
import { TableColumn, ColumnHelper } from '../common/column';
import { GridService } from '../grid/grid.service';
import { HistoryModel, Columns } from './history.model';
import { Helper } from 'nap-components/helper';
import * as moment from 'moment';
import { LimitLevel } from '../../common/filter';
import { HttpEventType } from '@angular/common/http';
import { ToastService } from 'nap-components/toast';

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
    private gridService: GridService,
    private toastService: ToastService
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
        () => historyModel.isNotified = true
    );
    return false;
  }

  exportExcel(historyModel: HistoryModel) {
    const formattedDate = moment(historyModel.modifiedDate).format('YYYYMMDD');
    const fileName = `${formattedDate}/${this.username}_${formattedDate}_${historyModel.logID}.xlsx`;
    this.gridService.downloadFile(fileName)
      .subscribe(response => {
        if (response.type.toString() === 'text/plain') {
          this.toastService.activate('File not found!');
        } else {
          Helper.downloadFile(response, fileName);
        }
        
      });
  }

  isRedOrYellowLimitLevel(level: number): boolean {
          return level === LimitLevel.Red || level === LimitLevel.Yellow;
    }

  private internalUnCheckNotification(historyModel: HistoryModel) {
    this.gridService.unCheckNotification(historyModel.logID, this.custId).subscribe(commandResult => {
        historyModel.isNotified = commandResult.errorCode !== 0;
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
