import { Component } from '@angular/core';
import { MonitorCriteria } from './filter/filter.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  monitorCriteria: MonitorCriteria | undefined;

  constructor(){}

  generate(monitorCriteria: MonitorCriteria): void {
    this.monitorCriteria = monitorCriteria;
  }
}
