import { Component, OnInit } from '@angular/core';
import { SavedFilterQueryModel } from '../filter.model';
import { SavedFilterService } from './saved-filter.service';
import { ConfirmationService } from 'nap-components/confirmation';
import { ActionConstants, ReportConstants } from '../../common/constants';
import { TypeaheadQuery } from 'nap-components/dropdown-typeahead';
import * as _ from 'lodash';
import { ModalContext } from '../../../components/modal';

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
  filterNameTypeaheadQuery = this.buildFilterNameTypeaheadQuery();
  queryModel: SavedFilterQueryModel = {
    reportId: ReportConstants.HEADLINE_NON_SPORT,
    reportName: ReportConstants.HEADLINE_NON_SPORT_TEXT,
    action: ActionConstants.SELECT
  };

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
    if (this.filterName.trim().length <= 0) {
      this.showNotification('#fff3cd', 'Filter name field is required!');
      return;
    }

    if (this.filterName.trim().length > 50) {
      this.showNotification('#fff3cd', 'Maximum 50 characters');
      return;
    }

    this.savedFilterService.queryFilters(this.queryModel, false).subscribe(data => {
      const filter = data.find(item => item.queryName === this.filterName);
      if (filter !== undefined) {
        this.confirmationService.openContent(
          `${this.filterName} already exists. Do you want to replace it?`,
          () => this.saveFilter(ActionConstants.UPDATE, filter.queryId)
        );
      } else {
        if (data.length >= 10) {
          this.showNotification('#fff3cd', 'Cannot save! Maximum 10 filters.');
        } else {
          this.saveFilter(ActionConstants.INSERT);
        }
      }
    });
  }

  private buildFilterNameTypeaheadQuery(): TypeaheadQuery {
    return new TypeaheadQuery(term => {
      let searchText = term.replace(/,/g, '');
      let words = searchText.split(' ');
      words = words.filter(word => word.trim() !== '');
      searchText = words.join(',');
      const model = _.cloneDeep(this.queryModel);
      model.queryName = searchText;
      return this.savedFilterService.queryFilters(model, true)
        .map(list => {
          return list.map(item => item.queryName);
        });
    });
  }

  private saveFilter(action: number, queryId?: number) {
    const saveModel: SavedFilterQueryModel = {
      queryId: queryId,
      queryName: this.filterName,
      content: this.content,
      reportId: ReportConstants.HEADLINE_NON_SPORT,
      reportName: ReportConstants.HEADLINE_NON_SPORT_TEXT,
      action: action
    };

    this.savedFilterService.executeFilter(saveModel).subscribe(() => {
      this.showNotification('#d4edda', 'Save Filter successfully!');
      this.filterName = '';
    })
  }

  private showNotification(color: string, message: string) {
    this.notificationColor = color;
    this.notification = message;
    this.hasNotification = true;
  }
}
