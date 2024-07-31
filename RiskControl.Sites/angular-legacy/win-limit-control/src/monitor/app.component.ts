import { Component, ElementRef } from '@angular/core';
import { FilterModel } from './filter';

@Component({
  selector: 'nap-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../../node_modules/nap-theme/scss/header.scss'
  ]
})
export class AppComponent {
  filterModel: FilterModel;
  downFileApi: string;

  constructor(private elementRef: ElementRef) {
    this.downFileApi = this.elementRef.nativeElement.getAttribute('downfileapi');
  }
}
