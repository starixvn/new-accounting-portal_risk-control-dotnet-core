import { Component } from '@angular/core';
import * as _ from 'lodash';
import { StatisticReportModel, Grid } from 'src/app/common/model';
import { DailyService } from './daily.service';
import { GridService } from '../grid.service';
import { FilterModel, ReportType } from 'src/app/filter/filter.model';
import { Observable } from 'rxjs';
import { DATE_CONFIG } from 'src/app/common/date-config';
import * as moment from 'moment';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements Grid {
  reportData: StatisticReportModel;
  sortColumnName = '';
  sortDirection = '';

  constructor(private readonly gridService: GridService, private readonly dailyService: DailyService) {
    this.sortColumnName = this.gridService.filterModel.sortColumnName;
    this.sortDirection = this.gridService.filterModel.sortDirection;
  }

  query(): Observable<StatisticReportModel> {
    return Observable.create(observer => {
      const filterModel = this.gridService.filterModel;
      this.dailyService.query(filterModel).subscribe(data => {
        this.reportData = data;
        observer.complete();
      });
    });
  }

  exportExcel(title: string) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.dailyService.exportExcel(title, filterModel);
  }

  get title(): string {
    return 'Daily';
  }

  get hasExcel() {
    return this.hasData;
  }

  get hasData(): boolean {
    return !_.isNil(this.reportData) && this.reportData.statistics.length > 0;
  }

  showProductReport(date: string) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    const formatedDate = moment(date).format(DATE_CONFIG.dateFormatYYYY_MM_DD);
    filterModel.fromDate = formatedDate;
    filterModel.toDate = formatedDate;
    filterModel.reportType = ReportType.Product;
    this.gridService.generate(filterModel);
  }

  sort(sortColumnName: string) {
    if (this.sortColumnName !== sortColumnName) {
      this.sortDirection = '';
    }

    this.sortColumnName = sortColumnName;
    this.sortDirection = this.sortDirection !== 'asc' ? 'asc' : 'desc';

    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.dailyService.query(filterModel).subscribe(data => {
      this.reportData = data;
    });
  }
}
