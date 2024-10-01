import { Component, ElementRef, OnInit } from '@angular/core';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { HeadlineService } from './headline.service';
import { GrandTotalService, GridService, ModelService, TitleService } from '../common';
import { ModalService } from 'components/modal';
import { ModeContext } from '../mode-context';
import { ModeController } from '../mode-controller';
import * as _ from 'lodash';
import { QueryModel } from 'app/app.model';
import { FilterConfig } from 'app/filter/filter.config';
import { Helper } from 'nap-components/helper';
import { LocalStorageKey } from 'app/common/constants';

@Component({
  selector: 'app-headline',
  templateUrl: '../grid.html',
  providers: [
    HeadlineService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class HeadlineComponent implements OnInit, ModeGenerate {
  gridOptions!: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly headlineService: HeadlineService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit(): void {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.modelService.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.headlineService.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef): void {
    throw new Error('Method not implemented.');
  }
  generateTitle(isLast: boolean): string {
    throw new Error('Method not implemented.');
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: QueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      this.updateMonthColumn(gridOptions);
      this.updateGrandTotalCell(gridOptions);
      if (this.gridService.hasCurrencyColumn()) {
        this.updateCurrencyColumn(gridOptions);
      }
    }

    gridOptions.titleInfo = {
      text: this.modeController.generateBreadcrumb(true),
      showExcelButton: true,
      exportExcelFunction: () => this.excel(queryModel)
    };
    gridOptions.sortOption = {
      serverSortFunction:
        (sortColumnName: string, sortDirection: string) => this.sort(queryModel, sortColumnName, sortDirection)
    };
    this.gridOptions = gridOptions;
  }

  private updateMonthColumn(gridOptions: GridOptions) {
    gridOptions.bodyRows.forEach(row => {
      const column = row.columns[0];
      column.value = `<a href="javascript:;" drill-down-daily month="${column.value}">${column.value}</a>`;
    });
  }

  private updateGrandTotalCell(gridOptions: GridOptions) {
    const row = gridOptions.footerRows[0];
    const column = row.columns[0];
    const value = column.value;
    column.value = `<a href="javascript:;" grand-total>${value}</a>`;
  }

  private updateCurrencyColumn(gridOptions: GridOptions) {
    const currencyColumn = FilterConfig.gridColumns.currency;
    gridOptions.bodyRows.forEach(row => {
      const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
      for (const column of row.columns) {
        if (column.name === currencyColumn.value) {
          const currency = column.customAttr;
          const date = rowAttribute.groupName;
          column.value = `<a href="javascript:;" drill-down-currency currency="${currency}" date="${date}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private excel(queryModel: QueryModel) {
    this.headlineService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: QueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    localStorage.setItem(LocalStorageKey.SORT, `${queryModel.sortColumnName}**${queryModel.sortDirection}}`);
    this.headlineService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }

}
