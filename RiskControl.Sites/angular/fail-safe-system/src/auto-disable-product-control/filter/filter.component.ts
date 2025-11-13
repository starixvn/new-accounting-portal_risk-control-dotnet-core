import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from './filter.service';
import { ConfirmationService } from 'nap-components/confirmation';
import { AutoDisableProductCriteria } from './filter.model';
import { MessageType, ToastService } from 'nap-components/toast';
import { AutoDisableProductModel } from '../grid/grid.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() logsLoaded = new EventEmitter<AutoDisableProductModel[]>();
  autoDisable = true;
  description = '';
  currentAutoDisableStatus = true;

  constructor(private readonly filterService: FilterService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.filterService.getCurrentStatus().subscribe((result) => {
      if (result) {
        this.autoDisable = result.isAutoDisableProduct;
        this.currentAutoDisableStatus = result.isAutoDisableProduct;
      }
    });
  }

  save(): void {
    if (this.autoDisable === this.currentAutoDisableStatus) {
        this.toastService.activate('No changes detected, nothing to save.', MessageType.Warning);
        return;
      }
    if (this.description.trim() === '') {
      this.toastService.activate('Reason for change is required !', MessageType.Danger);
      return;
    } else {
      const status = this.autoDisable ? 'enable' : 'disable';
      this.confirmationService.openContent(`Are you sure you want to ${status} the Auto-Disable Product?`, () => {
        const criteria: AutoDisableProductCriteria = {
          isAutoDisableProduct: this.autoDisable,
          description: this.description
        };
        this.filterService.save(criteria).subscribe(() => {
          this.description = '';
          this.currentAutoDisableStatus = this.autoDisable;
          this.viewLogs();
          this.toastService.activate('Saved successfully!', MessageType.Success);
        });
      });
    }
    
  }

  viewLogs(): void {
    this.filterService.getData().subscribe((logs) => {
      this.logsLoaded.emit(logs);
    });
  }

}
