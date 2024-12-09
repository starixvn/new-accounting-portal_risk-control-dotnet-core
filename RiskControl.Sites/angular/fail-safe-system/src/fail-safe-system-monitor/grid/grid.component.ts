import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MonitorCriteria } from '../filter/filter.model';
import { GridModel } from './grid.model';
import { PaginationService as NgxPaginationService, PaginatePipe } from 'ngx-pagination';
import { PaginationInstance, PaginationService } from 'nap-components/pagination';
import { GridService } from './grid.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges {
  @Input() monitorCriteria: MonitorCriteria | undefined;
  gridData: GridModel[] = [];
  displayedModels: GridModel[] | undefined;
  paginationInstance!: PaginationInstance;
  checkAll: boolean = false;
  private paginatePipe: PaginatePipe;

  constructor(private readonly gridService: GridService,
    private readonly paginationService: PaginationService,
    private readonly ngxPaginationService: NgxPaginationService
  ) { 
    this.paginatePipe = new PaginatePipe(this.ngxPaginationService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.monitorCriteria !== undefined) {
      this.getGridData();
    }
    
  }

  onPageChange() {
    const displayedModels = this.paginatePipe.transform(this.gridData, this.paginationInstance);
    this.displayedModels = _.cloneDeep(displayedModels);
  }

  private getGridData(): void {
    this.gridService.getMonitors(this.monitorCriteria!).subscribe(data => {
      this.gridData = data;
      this.paginationInstance = this.paginationService.createPaginationInstance(this.gridData.length);
      this.onPageChange();
    });
  }

  getIndex(index: number): number {
    return index + (this.paginationInstance.currentPage - 1) * this.paginationInstance.itemsPerPage;
  }

  countdownCallback() {
    this.getGridData();
}

}
