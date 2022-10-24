import { Component } from '@angular/core';
import { FilterModel } from './filter/filter.model';

@Component({
  selector: 'nap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isHideFilter = false;
  filterModel: FilterModel;

  showHideFilter() {
    this.isHideFilter = !this.isHideFilter;
  }

  generate(filterModel: FilterModel) {
    this.filterModel = filterModel;
  }
}
