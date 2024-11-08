import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SettingCriteria } from '../filter/filter.model';
import { GridModel } from './grid.model';
import { GridService } from './grid.service';
import { PaginationService as NgxPaginationService, PaginatePipe } from 'ngx-pagination';
import { PaginationInstance, PaginationService } from 'nap-components/pagination';
import * as _ from 'lodash';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges {
  @Input() settingCriteria: SettingCriteria | undefined;
  gridData: GridModel[] = [];
  displayedModels: GridModel[] = [];
  paginationInstance!: PaginationInstance;
  private paginatePipe: PaginatePipe;

  constructor(private readonly gridService: GridService,
    private readonly paginationService: PaginationService,
    private readonly ngxPaginationService: NgxPaginationService,
  ) { 
    this.paginatePipe = new PaginatePipe(this.ngxPaginationService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.settingCriteria !== undefined) {
      this.gridService.getSettings(this.settingCriteria).subscribe(data => {
        this.gridData = data;
        this.paginationInstance = this.paginationService.createPaginationInstance(this.gridData.length);
        this.onPageChange();
      });
    }
  }

  onPageChange() {
    const displayedModels = this.paginatePipe.transform(this.gridData, this.paginationInstance);
    this.displayedModels = _.cloneDeep(displayedModels);
  }

  getIndex(index: number): number {
    return index + (this.paginationInstance.currentPage - 1) * this.paginationInstance.itemsPerPage;
  }

  editRule(ruleId: number): void {

  }

  checkAllDelete(): void {

  }

  deleteRule(): void {

  }
}
