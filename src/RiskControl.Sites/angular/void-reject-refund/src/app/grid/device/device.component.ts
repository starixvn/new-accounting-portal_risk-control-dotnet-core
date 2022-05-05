import { Component } from '@angular/core';
import * as _ from 'lodash';
import { GroupStatisticReportModel, Grid } from 'src/app/common/model';
import { GridService } from '../grid.service';
import { DeviceService } from './device.service';
import { FilterModel } from 'src/app/filter/filter.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements Grid {
  reportData: GroupStatisticReportModel;
  sortColumnName = '';
  sortDirection = '';

  constructor(private readonly gridService: GridService, private readonly deviceService: DeviceService) { }

  query(): Observable<GroupStatisticReportModel> {
    return Observable.create(observer => {
      const filterModel = this.gridService.filterModel;
      this.deviceService.query(filterModel).subscribe(data => {
        this.reportData = data;
        observer.complete();
      });
    });
  }

  exportExcel(title: string) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.deviceService.exportExcel(title, filterModel);
  }

  get title(): string {
    return 'Device';
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
    this.deviceService.query(filterModel).subscribe(data => {
      this.reportData = data;
    });
  }
}
