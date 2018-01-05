import { Component } from '@angular/core';
import { FilterModel } from './filter';

@Component({
  selector: 'nap-currency-setting',
  templateUrl: './currency-setting.component.html'
})
export class CurrencySettingComponent {
  filterModel: FilterModel;
}
