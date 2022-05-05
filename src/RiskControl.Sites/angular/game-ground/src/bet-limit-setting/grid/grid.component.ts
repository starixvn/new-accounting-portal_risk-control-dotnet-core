import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FilterModel } from '../filter';
import { SettingModel } from './grid.model';
import { GridService } from './grid.service';
import { ToastService, MessageType } from 'nap-components/toast';
import { ConfirmationService } from 'nap-components/confirmation';
@Component({
  selector: 'nap-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [GridService]
})
export class GridComponent implements OnChanges, OnInit {
  @Input() filterModel: FilterModel;
  breadcrumbItems = ['Game Round Bet Limit Setting'];
  settingModels: SettingModel[];
  displayModels: SettingModel[];
  hasHostPermission: boolean;
  hasData: boolean;

  constructor(
    private readonly gridService: GridService,
    private readonly toastService: ToastService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.gridService.hasHostPermission().subscribe(hasHostPermission => {
      this.hasHostPermission = hasHostPermission;
    });
  }

  ngOnChanges() {
    if (this.filterModel == null) {
      return;
    }

    this.settingModels = undefined;
    this.gridService.query(this.filterModel).subscribe(settingModels => {
      this.settingModels = settingModels;
      this.displayModels = _.cloneDeep(settingModels);
      this.hasData = settingModels.length > 0;
    });
  }

  save() {
    const modifiedSettings = this.getModifiedSettings();
    if (modifiedSettings.length === 0) {
      this.toastService.activate(
        'There is no change to save',
        MessageType.Warning
      );
      return;
    }
    this.confirmationService.openContent(
      'Are you sure want to change this setting?',
      () => this.internalSave(modifiedSettings)
    );
  }

  private getModifiedSettings(): SettingModel[] {
    const modifiedSettings: SettingModel[] = [];
    for (let i = 0; i < this.displayModels.length; i++) {
      const displayModel = this.displayModels[i];
      const settingModel = this.settingModels[i];
      if (displayModel.GameRoundBetLimit !== settingModel.GameRoundBetLimit) {
        modifiedSettings.push(displayModel);
      }
    }

    return modifiedSettings;
  }

  private internalSave(modifiedSettings: SettingModel[]) {
    this.gridService.update(modifiedSettings).subscribe(() => {
      this.toastService.activate(
        'The setting has been updated successfully!',
        MessageType.Success,
        3
      );
      this.settingModels = _.cloneDeep(this.displayModels);
    });
  }

  cancel() {
    this.displayModels = _.cloneDeep(this.settingModels);
  }
}
