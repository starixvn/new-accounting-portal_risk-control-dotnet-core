import { Component, OnInit } from '@angular/core';
import { FilterModel } from './filter/filter.model';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  filterModel: FilterModel | undefined;
  hasHostPermission: boolean = false;

  constructor(private readonly appService: AppService){}

  ngOnInit(): void {
    this.appService.getHostPermission().subscribe(hostPermission => this.hasHostPermission = hostPermission);
  }

  generate(filterModel: FilterModel): void {
    this.filterModel = filterModel;
  }
}
