import { Component, OnInit } from '@angular/core';
import { MessageType, ToastService } from 'nap-components/toast';
import { Product } from '../common/filter/filter.model';
import { FilterService } from '../common/filter/filter.service';
import { GameGroupSetting, GroupGroupSettingModel, GroupSettingModel, UnssignedBettypeModel } from './app.model';
import { AppService } from './app.service';
import * as _ from 'lodash';
import { ConfirmationService } from 'nap-components/confirmation';
import { AuthorizationService } from '../common/authorization';

@Component({
  selector: 'nap-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ],
  providers: [
    FilterService,
    AppService,
    AuthorizationService
  ]
})
export class AppComponent implements OnInit {
  products: Product[];
  productId: number;
  bettypeProductId: number;
  productName: string;
  representativeBettype: number;
  isDislayContent = false;
  unsignedBettypes: UnssignedBettypeModel[] = [];
  groupSettings: GroupGroupSettingModel[] = [];
  hasHostPermission: boolean;

  constructor(
    private filterService: FilterService,
    private appService: AppService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private authorizationService: AuthorizationService
) { }

  ngOnInit() {
    this.filterService.queryProducts().subscribe(products => {
        this.products = products;
    });

    this.authorizationService.getHostPermission().subscribe((result) => {
      this.hasHostPermission = result.currencyWinLimitSetting;
    });
  }

  onProductChange(): void {

  }

  search(): void {
    this.toastService.deactivate();
    if (this.productId === undefined) {
      this.toastService.activate('Please select a product');
      return;
    }
    this.appService.queryRepresentativeBettype(this.productId).subscribe(model => {
      if (model === null) {
        this.bettypeProductId = null;
        this.productName = null;
        this.representativeBettype = null;
      } else {
        this.bettypeProductId = model.productID;
        this.productName = model.productName;
        this.representativeBettype = model.betType;
      }
    });

    this.appService.queryUnssignedBettypes(this.productId).subscribe(models => {
      this.unsignedBettypes = models;
    });

    this.appService.queryGroupSettings(this.productId).subscribe(models => {
      this.groupSettings = models;
    });

    this.isDislayContent = true;
  }

  clickUnsignedBettypeRow(item: UnssignedBettypeModel): void {
    item.selected = !item.selected;
  }

  clickGroupGroupSettingRow(item: GroupGroupSettingModel): void {
    _.forEach(this.groupSettings, x => {
      x.selected = false;
    });
    item.selected = !item.selected;
  }

  clickGroupSettingRow(item: GroupSettingModel): void {
    if (item.isLegend)
    {
      item.selected = !item.selected;
    }
  }

  isMoveIn(): boolean {
    return _.some(this.unsignedBettypes, ['selected', true]) && _.some(this.groupSettings, ['selected', true]);
  }

  moveIn(): void {
    let removedUnsignedBettypes: UnssignedBettypeModel[] = [];
    _.forEach(this.unsignedBettypes, item => {
      if (item.selected)
      {
        this.insertUnsignedBettypesToGroupSetting(item);
        removedUnsignedBettypes.push(item);
      }
    });
    if (removedUnsignedBettypes.length > 0)
    {
      this.unsignedBettypes = _.difference(this.unsignedBettypes, removedUnsignedBettypes);
    }
  }

  moveOut(): void {
    let removedGroupGroupSettingModels: GroupGroupSettingModel[] = [];
    _.forEach(this.groupSettings, data => {
      let group: GroupGroupSettingModel = { groupID: data.groupID,
        productID: data.productID,
        groupName: data.groupName,
        selected: data.selected,
        items: [],
        maxItems: 10
      };
      _.forEach(data.items, item => {
        if (item.selected)
        {
          this.unsignedBettypes.unshift({ bettype: item.betTypeID, typenamee: item.typenamee, selected: false });
          group.items.push(item);
        }
      });
      removedGroupGroupSettingModels.push(group);
    });
    this.removeGroupSettingModelAfterMoveOut(removedGroupGroupSettingModels);
  }

  removeGroupSettingModelAfterMoveOut(list: GroupGroupSettingModel[]): void {
    for(let group of this.groupSettings) {
      for(let removedGroup of list) {
        if (group.groupID === removedGroup.groupID && group.productID === removedGroup.productID) {
          if (removedGroup.items.length > 0 && group.items.length > 0) {
            group.items = _.difference(group.items, removedGroup.items);
            break;
          }
        }
      }
    }
  }

  private insertUnsignedBettypesToGroupSetting(bettype: UnssignedBettypeModel): void {
    _.forEach(this.groupSettings, x => {
      if (x.selected)
      {
        const group: GroupSettingModel = {
          productID: x.productID,
          groupID: x.groupID,
          groupName: x.groupName,
          betTypeID: bettype.bettype,
          typenamee: bettype.typenamee,
          selected: false,
          isLegend: true
        }
        x.items.unshift(group);
      }
    });
  }

  isMoveOut(): boolean {
    for(let data of this.groupSettings)
    {
      for(let item of data.items)
      {
        if (item.selected)
        {
          return true;
        }
      }
    }
    return false;
  }

  save(): void {
     if (!this.hasDataBeforeSave()) {
      this.toastService.activate('There is no bettype to save', MessageType.Warning, 3);
      return;
     }
      this.confirmationService.openContent(
          'Are you sure want to save this setting?',
          () => this.internalSave()
      );
  }

  private internalSave() {
    const settings = this.getSettings();
    this.appService.initialSettings(settings).subscribe(result => {
        if (result.errorCode === 0) {
            this.toastService.activate('The settings has been updated successfully!', MessageType.Success, 3);
            this.search();
        } else {
            this.toastService.activate('Failed!!! Please try again', MessageType.Danger);
        }
    });
  }

  private hasDataBeforeSave(): boolean {
    for (let group of this.groupSettings)
    {
      if (_.some(group.items, ['isLegend', true])) {
        return true;
      }
    }
    return false;
  }

  private getSettings(): GameGroupSetting[] {
    let result: GameGroupSetting[] = [];
    _.forEach(this.groupSettings, group => {
      const bettypes: number[] = [];
      _.forEach(group.items, item => {
        if (item.isLegend)
        {
          bettypes.push(item.betTypeID);
        }
      })
      if (bettypes.length > 0) {
        const setting: GameGroupSetting = {
          productId: group.productID,
          groupId: group.groupID,
          bettypeIds: bettypes.join(','),
        };
        result.push(setting);
      }
    })
    return result;
  }

  cancel(): void {
    location.reload();
  }

  viewMore(group: GroupGroupSettingModel): void {
    group.maxItems = 10000;
  }
}
