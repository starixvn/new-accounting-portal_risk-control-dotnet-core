import { Component, OnInit } from '@angular/core';
import { ModalContext } from 'components/modal';
import { SavedFilterContentModel, SavedFilterQueryModel } from '../filter.model';
import { SavedFilterService } from './saved-filter.service';
import { ConfirmationService } from 'nap-components/confirmation';
import { ActionConstants, ReportConstants } from 'app/common/constants';

@Component({
  selector: 'app-save-filter',
  templateUrl: './save-filter.component.html',
  styleUrls: ['./save-filter.component.scss']
})
export class SaveFilterComponent implements OnInit {
  filterName = '';
  hasNotification = false;
  notification = '';
  notificationColor = '#fff3cd';
  content = '';

  constructor(private readonly modalContext: ModalContext,
    private readonly savedFilterService: SavedFilterService,
    private readonly confirmationService: ConfirmationService
  ) { 
    this.content = modalContext.data as string;
  }

  ngOnInit(): void {
  }

  close() {
    this.modalContext.close();
  }

  onSave() {
    if (this.filterName.trim().length > 50) {
      this.showNotification('#fff3cd', 'Maximum 50 characters');
      return;
    }

    const queryModel: SavedFilterQueryModel = {
      reportId: ReportConstants.NON_SPORT,
      reportName: ReportConstants.NON_SPORT_TEXT,
      action: ActionConstants.SELECT
    };

    this.savedFilterService.queryFilters(queryModel).subscribe(data => {
      if (data.length >= 10) {
        this.showNotification('#fff3cd', 'Cannot save! Maximum 10 filters.');
        return;
      }
      const filter = data.find(item => item.queryName === this.filterName);
      if (filter !== undefined) {
        this.confirmationService.openContent(
          `${this.filterName} already exists. Do you want to replace it?`,
          () => this.saveFilter(ActionConstants.UPDATE, filter.queryId)
        );
      } else {
        this.saveFilter(ActionConstants.INSERT);
      }
    });
  }

  suggestFilter() {
    console.log(this.filterName);
  }

  private saveFilter(action: number, queryId?: number) {
    const saveModel: SavedFilterQueryModel = {
      queryId: queryId,
      queryName: this.filterName,
      content: this.content,
      reportId: ReportConstants.NON_SPORT,
      reportName: ReportConstants.NON_SPORT_TEXT,
      action: action
    };

    this.savedFilterService.executeFilter(saveModel).subscribe(() => {
      this.showNotification('#d4edda', 'Save Filter successfully!');
    })
  }

  private showNotification(color: string, message: string) {
    this.notificationColor = color;
    this.notification = message;
    this.hasNotification = true;
  }
}
