import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import {
  PaginationService as NgxPaginationService,
  PaginatePipe
} from 'ngx-pagination';
import {
  PaginationInstance,
  PaginationService,
  PaginationConfig
} from 'nap-components/pagination';
import { FilterModel } from '../filter';
import { MonitorModel } from './grid.model';
import { GridService } from './grid.service';

@Component({
  selector: 'nap-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [GridService]
})
export class GridComponent implements OnChanges {
  @Input() filterModel: FilterModel;
  breadcrumbItems = ['Game Round Bet Limit Monitor'];
  paginationInstance: PaginationInstance;
  monitorModels: MonitorModel[];
  displayedModels: MonitorModel[];
  hasData: boolean;

  private readonly paginatePipe: PaginatePipe;
  constructor(
    private readonly paginationService: PaginationService,
    private readonly gridService: GridService,
    private readonly ngxPaginationService: NgxPaginationService
  ) {
    this.paginatePipe = new PaginatePipe(this.ngxPaginationService);
  }

  ngOnChanges() {
    if (this.filterModel == null) {
      return;
    }

    this.monitorModels = undefined;
    this.gridService.query(this.filterModel).subscribe(monitorModels => {
      this.monitorModels = monitorModels;
      this.hasData = monitorModels && monitorModels.length > 0;
      this.paginationInstance = this.paginationService.createPaginationInstance(
        this.monitorModels.length
      );
      this.onPageChange();
    });
  }

  onPageChange() {
    const displayedModels = this.paginatePipe.transform(
      this.monitorModels,
      this.paginationInstance
    );
    this.displayedModels = _.cloneDeep(displayedModels);
  }

  private exportExcel() {
    this.gridService.exportExcel(this.filterModel);
  }
}
