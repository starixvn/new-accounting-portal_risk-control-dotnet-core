import { Component, Input, OnChanges } from '@angular/core';
import { ManageProductStatusCriteria } from '../filter/filter.model';
import { GridModel } from './grid.model';
import { GridService } from './grid.service';
import { HistoryService } from '../history/history.service';
import { ConfirmationService } from 'nap-components/confirmation';
import { MessageType, ToastService } from 'nap-components/toast';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges {
  @Input() criteria: ManageProductStatusCriteria | undefined;
  gridData: GridModel[] | undefined;

  constructor(private readonly gridService: GridService,
    private readonly historyService: HistoryService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: ToastService
  ) { }

  ngOnChanges(): void {
    this.getGridData();
  }

  onShowHistory(item: GridModel): void {
    this.historyService.show(item.productName, item.productId, item.sportType, item.sportName);
  }

  enableSport(sport: number): void {
    this.confirmationService.openContent('Are you sure you want to enable this sport?', () => {
      this.gridService.enableSport(sport).subscribe(() => {
        this.toastService.activate('The Sport has been enabled successfully!!!', MessageType.Success);
      });
    });
  }

  private getGridData(): void {
    if (this.criteria !== undefined) {
      this.gridService.getData(this.criteria).subscribe(data => {
        this.gridData = data;
      });
    }
  }

}
