import { Component } from '@angular/core';
import { SettingCriteria } from './filter/filter.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  settingCriteria: SettingCriteria | undefined

  generate(settingCriteria: SettingCriteria): void {
    this.settingCriteria = settingCriteria;
  }
}
