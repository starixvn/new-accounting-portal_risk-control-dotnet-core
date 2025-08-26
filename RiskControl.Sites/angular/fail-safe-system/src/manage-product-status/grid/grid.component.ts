import { Component, Input, OnChanges } from '@angular/core';
import { ManageProductStatusCriteria } from '../filter/filter.model';
import { GridModel } from './grid.model';
import { GridService } from './grid.service';
import { HistoryService } from '../history/history.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges {
  @Input() criteria: ManageProductStatusCriteria | undefined;
  gridData: GridModel[] | undefined;

  constructor(private readonly gridService: GridService,
    private readonly historyService: HistoryService
  ) { }

  ngOnChanges(): void {
    this.getGridData();
  }

  onShowHistory(productName: string, productId: number): void {
    this.historyService.show(productName, productId);
  }

  private getGridData(): void {
    if (this.criteria !== undefined) {
      this.gridService.getData(this.criteria).subscribe(data => {
        this.gridData = data;
      });
    }
  }

}
