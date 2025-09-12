import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
export class GridComponent implements OnChanges, OnInit {
  @Input() criteria: ManageProductStatusCriteria | undefined;
  gridData: GridModel[] | undefined;
  hasHostPermission: boolean = false;

  constructor(private readonly gridService: GridService,
    private readonly historyService: HistoryService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.gridService.getHostPermission().subscribe(hostPermission => this.hasHostPermission = hostPermission);
  }

  ngOnChanges(): void {
    this.getGridData();
  }

  onShowHistory(item: GridModel): void {
    this.historyService.show(item.productName, item.productId, item.sportType, item.sportName);
  }

  enableSport(sport: number, productId: number): void {
    this.confirmationService.openContent('Are you sure you want to enable this sport?', () => {
      this.gridService.enableSport(sport, productId).subscribe(result => {
        if (result.errorCode === 0 || result.errorCode === 1012) {
          this.toastService.activate('The Sport has been enabled successfully!!!', MessageType.Success);
          this.gridData?.forEach(item => {
            if (item.productId === productId && item.sportType === sport) {
              item.status = 'Enabled';
            }
          });
        }
        else {
          this.toastService.activate('Oops! We couldn’t enable this sport. Please try again.', MessageType.Danger);
        }
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
