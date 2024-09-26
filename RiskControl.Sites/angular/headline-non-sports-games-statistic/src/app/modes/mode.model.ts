import { ElementRef } from '@angular/core';

export interface ModeGenerate {
  onAfterGenerate(grid: ElementRef): void;
  generateTitle(isLast: boolean): string;
}

export interface RowAttribute {
  groupId: string;
  groupName: string;
}

export class GridModel {
  readonly isDrillDownCurrency: boolean;

  constructor(isDrillDownCurrency: boolean) {
    this.isDrillDownCurrency = isDrillDownCurrency;
  }
}
