import { Component, OnInit } from '@angular/core';
import { SettingCriteria } from './filter/filter.model';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  settingCriteria: SettingCriteria | undefined;
  hasHostPermission: boolean = false;

  constructor(private readonly appService: AppService){}

  ngOnInit(): void {
    this.appService.getHostPermission().subscribe(hostPermission => this.hasHostPermission = hostPermission);
  }

  generate(settingCriteria: SettingCriteria): void {
    this.settingCriteria = settingCriteria;
  }
}
