import { Component } from '@angular/core';
import { FilterModel } from './filter';

@Component({
  selector: 'nap-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent {
  filterModel: FilterModel;
}
