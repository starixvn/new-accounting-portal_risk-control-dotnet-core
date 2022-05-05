import { Component } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DateHelper, DateFormat } from 'nap-components/date';
import { StatisticReportModel, Grid } from 'src/app/common/model';
import { GridService } from '../grid.service';
import { MonthlyService } from './monthly.service';
import { ReportType, FilterModel } from 'src/app/filter/filter.model';
import { DATE_CONFIG } from 'src/app/common/date-config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements Grid {
  reportData: StatisticReportModel;
  sortColumnName = '';
  sortDirection = '';

  constructor(private readonly gridService: GridService, private readonly monthlyService: MonthlyService) {
    this.sortColumnName = this.gridService.filterModel.sortColumnName;
    this.sortDirection = this.gridService.filterModel.sortDirection;
  }

  query(): Observable<StatisticReportModel> {
    return Observable.create(observer => {
      const filterModel = this.gridService.filterModel;
      this.monthlyService.query(filterModel).subscribe(data => {
        this.reportData = data;
        observer.complete();
      });
    });
  }

  exportExcel(title: string) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.monthlyService.exportExcel(title, filterModel);
  }

  get title(): string {
    return 'Monthly';
  }

  get hasExcel() {
    return this.hasData;
  }

  get hasData(): boolean {
    return !_.isNil(this.reportData) && this.reportData.Statistics.length > 0;
  }

  showDailyReport(monthText: string) {
    const month = DateHelper.convertStringToMomentDate(monthText, DATE_CONFIG.dateMonthFormatString);
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    const fromDate =  moment.max(moment.utc(month).startOf('month'), moment.utc(filterModel.fromDate));
    const toDate = moment.min(moment.utc(month).endOf('month'), moment.utc(filterModel.toDate));
    filterModel.reportType = ReportType.Daily;
    filterModel.fromDate =  DateHelper.formatMomentDate(fromDate, DateFormat.Date);
    filterModel.toDate = DateHelper.formatMomentDate(toDate, DateFormat.Date);
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
    this.monthlyService.query(filterModel).subscribe(data => {
      this.reportData = data;
    });
  }
}
