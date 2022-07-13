import { Component } from '@angular/core';
import * as _ from 'lodash';
import { StatisticReportModel, Grid } from 'src/app/common/model';
import { GridService } from '../grid.service';
import { CurrencyService } from './currency.service';
import { ReportType, FilterModel } from 'src/app/filter/filter.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements Grid {
  reportData: StatisticReportModel;
  sortColumnName = '';
  sortDirection = '';

  constructor(private readonly gridService: GridService, private readonly currencyService: CurrencyService) {
    this.sortColumnName = this.gridService.filterModel.sortColumnName;
    this.sortDirection = this.gridService.filterModel.sortDirection;
  }

  query(): Observable<StatisticReportModel> {
    return Observable.create(observer => {
      const filterModel = this.gridService.filterModel;
      this.currencyService.query(filterModel).subscribe(data => {
        this.reportData = data;
        observer.complete();
      });
    });
  }

  exportExcel(title: string) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.currencyService.exportExcel(title, filterModel);
  }

  get title(): string {
    return 'Currency';
  }

  get hasExcel() {
    return this.hasData;
  }

  get hasData(): boolean {
    return !_.isNil(this.reportData) && this.reportData.statistics.length > 0;
  }

  showCompanyReport(currencyId: number) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.currency =  [currencyId];
    filterModel.reportType = ReportType.Company;
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
    this.currencyService.query(filterModel).subscribe(data => {
      this.reportData = data;
    });
  }
}
