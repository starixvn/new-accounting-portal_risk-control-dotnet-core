import { Component } from '@angular/core';
import { FilterModel } from './filter';

@Component({
  selector: 'nap-currency-setting',
  templateUrl: './currency-setting.component.html',
  styleUrls: [
    './currency-setting.component.scss'
  ]
})
export class CurrencySettingComponent {
  filterModel: FilterModel;
}
