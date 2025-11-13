import { Component } from '@angular/core';
import { AutoDisableProductModel } from './grid/grid.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: AutoDisableProductModel[] | undefined;

  constructor(){}

  onLogsLoaded(data: AutoDisableProductModel[]): void {
    this.data = data;
  }
}
