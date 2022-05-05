import { Component } from '@angular/core';
import { FilterModel } from './filter/filter.model';

@Component({
  selector: 'nap-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'void-reject-refund';
  isHideFilter = false;
  filterModel: FilterModel;

  showHideFilter() {
    this.isHideFilter = !this.isHideFilter;
  }

  generate(filterModel: FilterModel) {
    this.filterModel = filterModel;
  }

  onReset() {
    this.filterModel = undefined;
  }
}
