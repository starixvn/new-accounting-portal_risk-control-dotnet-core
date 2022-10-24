import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { ModelService, TitleService, GridService } from '../common';
import { CurrencyService } from './currency.service';
import { CurrencyQueryModel, CurrencyGridModel } from './currency.model';
import { ModeContext } from '../mode-context';
import { ModeController } from '../mode-controller';
import { ModeGenerate } from '../mode.model';

@Component({
  selector: 'nap-company',
  templateUrl: '../grid.html',
  providers: [
    CurrencyService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class CurrencyComponent implements OnInit, ModeGenerate {
  gridOptions: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly currencyService: CurrencyService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.currencyService.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    $(grid.nativeElement).find('a[drill-down-company]').on('click', (event) => {
      const element = $(event.target);
      const currencyName = element.text();
      const currency = parseInt(element.attr('currency'), 10);
      this.drillDownCompany(currencyName, currency);
    });

    $(grid.nativeElement).find('a[grand-total]').on('click', (event) => {
      const element = $(event.target);
      const currency = parseInt(element.attr('currency'), 10);
      this.showGrandTotal(currency);
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private createQueryModel(): CurrencyQueryModel {
    let drillDownCurrency = 0;
    const gridModel = this.modeContext.gridModel;
    if (gridModel instanceof CurrencyGridModel) {
      drillDownCurrency = gridModel.drillDownCurrency;
    }
    const queryModel = this.modelService.createQueryModel();
    return Helper.extend(queryModel, {
      drillDownCurrency: drillDownCurrency
    });
  }

  private hasDrillDownCompany() {
    const gridModel = this.modeContext.gridModel;
    return !gridModel.isDrillDownCurrency;
  }

  private showGrandTotal(drillDownCurrency: number) {
    const queryModel = this.createQueryModel();
    queryModel.drillDownCurrency = drillDownCurrency;
    queryModel.title = this.titleService.getGrandTotalByCurrencyTitle();
    this.currencyService.queryGrandTotal(queryModel).subscribe(gridOptions => {
      gridOptions.fullHeight = false;
      gridOptions.gridHeight = 500;
      gridOptions.titleInfo = {
        text: gridOptions.titleInfoText,
        showExcelButton: true,
        exportExcelFunction: () => this.excelGrandTotal(queryModel)
      };
      this.modalService.open(GridModalComponent, { size: { width: 1200 } }, gridOptions);
    });
  }

  private drillDownCompany(title: string, currency: number) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    const modeContext = ModeContext.create(title, filterModel, new CurrencyGridModel(true, currency));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: CurrencyQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0) {
      if (this.hasDrillDownCompany()) {
        this.updateCurrencyColumn(gridOptions);
      }
      if (!this.gridService.isDrilldown()) {
        this.updateGrandTotalCell(gridOptions);
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

  private updateGrandTotalCell(gridOptions: GridOptions) {
    const row = gridOptions.footerRows[0];
    const column = row.columns[0];
    const currencyId = parseInt(column.customAttr, 10);
    const currencyName = column.value;
    column.value = `<a href="javascript:;" grand-total currency="${currencyId}">${currencyName}</a>`;
  }

  private updateCurrencyColumn(gridOptions: GridOptions) {
    gridOptions.bodyRows.forEach(row => {
      const column = row.columns[0];
      const currency = column.customAttr;
      column.value = `<a href="javascript:;" drill-down-company currency="${currency}">${column.value}</a>`;
    });
  }

  private excel(queryModel: CurrencyQueryModel) {
    this.currencyService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: CurrencyQueryModel) {
    this.currencyService.excelGrandTotal(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: CurrencyQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.currencyService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
