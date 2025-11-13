import { Component, Input } from '@angular/core';
import { GridService } from './grid.service';
import * as _ from 'lodash';
import { AutoDisableProductModel } from './grid.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  @Input() data: AutoDisableProductModel[] | undefined;

  constructor(private readonly gridService: GridService,
  ) {}
}
