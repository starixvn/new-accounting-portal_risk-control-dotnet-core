import { Component, Input, OnChanges, OnInit, ViewChildren, QueryList } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FilterModel, SearchType } from '../filter';
import { RealTimeRecord, MonthlyQueryModel, DailyQueryModel, WinnerRecord, GridType, MonthlyRecord, DailyRecord } from './grid.model';
import { GridService } from './grid.service';

@Component({
  selector: 'nap-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [
    GridService
  ]
})
export class GridComponent implements OnChanges {
  @Input() filterModel: FilterModel;
  breadcrumbItems: string[];
  GridType = GridType;
  gridType = GridType.None;
  realTimeRecords: RealTimeRecord[];
  monthlyRecords: MonthlyRecord[];
  dailyRecords: DailyRecord[];
  winnerRecords: WinnerRecord[];
  hasExcel = true;
  private monthlyQueryModel: MonthlyQueryModel;
  private dailyQueryModel: DailyQueryModel;

  constructor(
    private gridService: GridService
  ) { }

  ngOnChanges() {
    if (this.filterModel) {
      this.gridType = GridType.None;
      switch (this.filterModel.searchType) {
        case SearchType.RealTime:
          this.queryRealTime();
          break;
        case SearchType.Winner:
          this.queryWinner();
          break;
      }
    }
  }

  drillDownMonthly(record: RealTimeRecord) {
    this.gridType = GridType.Monthly;
    this.breadcrumbItems.push('Monthly');
    this.monthlyQueryModel = {
      level: record.level,
      pjMainId: record.pjMainId
    };
    this.monthlyRecords = undefined;
    this.gridService.queryMonthly(this.monthlyQueryModel).subscribe(records => {
      this.monthlyRecords = records;
      this.hasExcel = records.length > 0;
    });
  }

  drillDownDaily(record: MonthlyRecord) {
    this.gridType = GridType.Daily;
    this.breadcrumbItems.push('Daily');
    this.dailyQueryModel = {
      level: this.monthlyQueryModel.level,
      pjMainId: this.monthlyQueryModel.pjMainId,
      month: moment(record.month).format('MM-YYYY')
    };
    this.dailyRecords = undefined;
    this.gridService.queryDaily(this.dailyQueryModel).subscribe(records => {
      this.dailyRecords = records;
      this.hasExcel = records.length > 0;
    });
  }

  breadcrumbItemClick(index: number) {
    this.breadcrumbItems = this.breadcrumbItems.slice(0, index + 1);
    switch (index) {
      case 0:
        this.gridType = GridType.RealTime;
        this.hasExcel = this.realTimeRecords.length > 0;
        break;
      case 1:
        this.gridType = GridType.Monthly;
        this.hasExcel = this.monthlyRecords.length > 0;
        break;
    }
  }

  exportExcel() {
    switch (this.gridType) {
      case GridType.RealTime:
        this.gridService.excelRealTime(this.filterModel);
        break;
      case GridType.Monthly:
        this.gridService.excelMonthly(this.monthlyQueryModel);
        break;
      case GridType.Daily:
        this.gridService.excelDaily(this.dailyQueryModel);
        break;
      case GridType.Winner:
        this.gridService.excelWinner(this.filterModel);
        break;
    }
  }

  private queryRealTime() {
    this.breadcrumbItems = ['MAIN'];
    this.gridType = GridType.RealTime;
    this.realTimeRecords = undefined;
    this.gridService.queryRealTime(this.filterModel).subscribe(records => {
      this.realTimeRecords = records;
      this.hasExcel = records.length > 0;
    });
  }

  private queryWinner() {
    this.breadcrumbItems = ['WIN RECORD'];
    this.gridType = GridType.Winner;
    this.winnerRecords = undefined;
    this.gridService.queryWinner(this.filterModel).subscribe(records => {
      this.winnerRecords = records;
      this.hasExcel = records.length > 0;
    });
  }
}
