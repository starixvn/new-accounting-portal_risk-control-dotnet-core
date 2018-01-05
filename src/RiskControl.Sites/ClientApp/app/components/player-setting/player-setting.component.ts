import { Component } from '@angular/core';
import { FilterModel } from './filter';

@Component({
  selector: 'nap-player-setting',
  templateUrl: './player-setting.component.html'
})
export class PlayerSettingComponent {
  filterModel: FilterModel;
}
