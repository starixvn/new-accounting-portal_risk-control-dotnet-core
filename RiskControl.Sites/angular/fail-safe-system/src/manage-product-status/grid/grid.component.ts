import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ManageProductStatusCriteria } from '../filter/filter.model';
import { GridModel, GroupedGridModel } from './grid.model';
import { GridService } from './grid.service';
import { HistoryService } from '../history/history.service';
import { ConfirmationService } from 'nap-components/confirmation';
import { MessageType } from 'nap-components/toast';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges, OnInit {
  @Input() criteria: ManageProductStatusCriteria | undefined;
  gridData: GroupedGridModel[] | undefined;
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

  enableSports(sports: number[], productId: number): void {
    this.confirmationService.openContent('Are you sure you want to enable the selected sport(s)?', () => {
      this.gridService.enableSports(sports, productId).subscribe(results => {
        const successSports = results.filter(result => result.errorCode === 0 || result.errorCode === 1012);
        const failedSports = results.filter(result => result.errorCode !== 0 && result.errorCode !== 1012);
        let messageResults = '';
        if (successSports.length > 0) {
          const sportTypes = successSports.map(s => s.seq);
          const sportNames = this.getSportNames(sportTypes, productId);
          messageResults += `The following has been enabled successfully: ${sportNames}<br/>`;
          this.setEnabledStatus(sportTypes, productId);
        }
        if (failedSports.length > 0) {
          const sportTypes = failedSports.map(s => s.seq);
          const sportNames = this.getSportNames(sportTypes, productId);
          messageResults += `<span class="text-danger">The system was unable to enable the following sports: ${sportNames}. Please check and try again!</span>`;
        }
        this.toastService.activate(messageResults, MessageType.Success);
      });
    });
  }

  enableSport(sport: number, productId: number, sportName: string): void {
    this.confirmationService.openContent('Are you sure you want to enable the selected sport(s)?', () => {
      this.gridService.enableSport(sport, productId).subscribe(result => {
        if (result.errorCode === 0 || result.errorCode === 1012) {
          this.toastService.activate(`The following has been enabled successfully: ${sportName}`, MessageType.Success);
          this.gridData?.forEach(item => {
            item.items.forEach(subItem => {
              if (subItem.productId === productId && subItem.sportType === sport) {
                subItem.status = 'Enabled';
              }
            });
          });
        }
        else {
          this.toastService.activate(`The system was unable to enable the following sports: ${sportName}. Please check and try again!`, MessageType.Danger);
        }
      });
    });
  }

  private getSportNames(sportTypes: string[], productId: number): string {
    const names: string[] = [];
    this.gridData?.forEach(item => {
      if (item.productId === productId) {
        item.items.forEach(subItem => {
          if (sportTypes.includes(subItem.sportType.toString())) {
            names.push(subItem.sportName);
          }
        });
      }
    });
    return names.join(', ');
  }

  private setEnabledStatus(sportTypes: string[], productId: number): void {
    let allEnabled = true;
    this.gridData?.forEach(item => {
      if (item.productId === productId) {
        item.items.forEach(subItem => {
          if (sportTypes.includes(subItem.sportType.toString())) {
            subItem.status = 'Enabled';
          } else {
            if (subItem.status !== 'Enabled') {
              allEnabled = false;
            }
          }
        });
        item.status = allEnabled ? 'Enabled' : 'Disabled';
      }
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
