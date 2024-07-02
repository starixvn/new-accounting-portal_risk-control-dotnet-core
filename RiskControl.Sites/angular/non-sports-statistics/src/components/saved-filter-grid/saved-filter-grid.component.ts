import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalContext } from 'components/modal';
import { SavedFilterGridModel } from './saved-filter-grid.model';
import { SavedFilterService } from 'app/filter/save-filter/saved-filter.service';
import { ConfirmationService } from 'nap-components/confirmation';
import { SavedFilterQueryModel } from 'app/filter';
import { ActionConstants } from 'app/common/constants';

@Component({
  selector: 'app-saved-filter-grid',
  templateUrl: './saved-filter-grid.component.html',
  styleUrls: ['./saved-filter-grid.component.scss']
})
export class SavedFilterGridComponent implements OnInit {
  data: SavedFilterGridModel[];

  constructor(private readonly modalContext: ModalContext,
    private readonly confirmationService: ConfirmationService,
    private readonly savedFilterService: SavedFilterService
  ) {
    this.data = modalContext.data as SavedFilterGridModel[];
   }

  ngOnInit(): void {
  }

  close() {
    this.modalContext.close();
  }

  reloadFilter(content: string) {
    this.modalContext.close();
  }

  onDelete(queryId: number) {
    this.confirmationService.openContent(
      'Are you sure you want to remove this filter?',
      () => this.deleteFilter(queryId)
    );
  }

  private deleteFilter(queryId: number) {
    const deletedModel: SavedFilterQueryModel = {
      queryId: queryId,
      action: ActionConstants.DELETE
    };
    this.savedFilterService.executeFilter(deletedModel).subscribe(() => {
      this.data = this.data.filter(item => item.queryId !== queryId);
    })
  }
}
