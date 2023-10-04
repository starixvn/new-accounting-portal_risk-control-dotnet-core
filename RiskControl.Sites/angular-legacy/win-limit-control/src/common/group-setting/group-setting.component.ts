import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HiddenProductBetTypeSetting, ProductBetTypeSetting } from './group-setting.model';

@Component({
  selector: 'nap-group-setting',
  templateUrl: './group-setting.component.html',
  styleUrls: [
    './group-setting.component.scss'
  ]
})
export class GroupSettingComponent {
  hiddenSettings: HiddenProductBetTypeSetting[];
  private lastToggleHiddenSetting: HiddenProductBetTypeSetting;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  updateSettings(settings: ProductBetTypeSetting[], productName: string) {
    this.hiddenSettings = settings.map(setting => {
      const hiddenSetting = <HiddenProductBetTypeSetting>{
        hidden: setting.productName !== productName,
        setting: setting
      };
      if (!hiddenSetting.hidden) {
        this.lastToggleHiddenSetting = hiddenSetting;
      }
      return hiddenSetting;
    });
  }

  toggleHidden(hiddenSetting: HiddenProductBetTypeSetting) {
    if (this.lastToggleHiddenSetting !== hiddenSetting) {
      if (this.lastToggleHiddenSetting) {
        this.lastToggleHiddenSetting.hidden = true;
      }
    }
    hiddenSetting.hidden = !hiddenSetting.hidden;
    this.lastToggleHiddenSetting = hiddenSetting;
  }
}
