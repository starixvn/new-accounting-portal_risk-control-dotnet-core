import { Component } from '@angular/core';
import { FilterModel } from './filter';

@Component({
  selector: 'nap-monitor',
  templateUrl: './monitor.component.html'
})
export class MonitorComponent {
  filterModel: FilterModel;
}
