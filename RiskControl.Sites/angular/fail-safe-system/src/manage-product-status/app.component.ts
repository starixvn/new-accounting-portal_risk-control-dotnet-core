import { Component, OnInit } from '@angular/core';
import { ManageProductStatusCriteria } from './filter/filter.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  criteria: ManageProductStatusCriteria | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  generate(criteria: ManageProductStatusCriteria): void {
      this.criteria = criteria;
  }

}
