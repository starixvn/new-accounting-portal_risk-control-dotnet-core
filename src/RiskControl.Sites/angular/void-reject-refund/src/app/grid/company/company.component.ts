import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import * as _ from 'lodash';
import { CompanyService } from './company.service';
import { GroupStatisticReportModel, Grid } from 'src/app/common/model';
import { GridService } from '../grid.service';
import { FilterModel } from 'src/app/filter/filter.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements Grid {
  reportData: GroupStatisticReportModel;
  sortColumnName = '';
  sortDirection = '';

  constructor(private readonly gridService: GridService, private readonly companyService: CompanyService) { }

  query(): Observable<GroupStatisticReportModel> {
    return Observable.create(observer => {
      const filterModel = this.gridService.filterModel;
      this.companyService.query(filterModel).subscribe(data => {
        this.reportData = data;
        observer.complete();
      });
    });
  }

  exportExcel(title: string) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.companyService.exportExcel(title, filterModel);
  }

  get title(): string {
    return 'Company';
  }

  get hasExcel() {
    return this.hasData;
  }

  get hasData(): boolean {
    return !_.isNil(this.reportData) && this.reportData.Statistics.length > 0;
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
    this.companyService.query(filterModel).subscribe(data => {
      this.reportData = data;
    });
  }
}
