import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { QueryModel } from '../../app.model';
import { ModelService, TitleService, GridService } from '../common';
import { DeviceService } from './device.service';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { ModeController } from '../mode-controller';
import { GrandTotalService } from '../common/grand-total.service';
import { FilterConfig } from '../../filter/filter.config';

@Component({
  selector: 'nap-daily',
  templateUrl: '../grid.html',
  providers: [
    DeviceService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class DeviceComponent implements OnInit, ModeGenerate {
  gridOptions!: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly deviceService: DeviceService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.modelService.createQueryModel();
    const gridModel = this.modeContext.gridModel;
    if (_.isNil(gridOptions)) {
      this.deviceService.query(queryModel, gridModel.isDrillDownCurrency).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    $(grid.nativeElement).find('a[drill-down-currency]').on('click', (event) => {
      const element = $(event.target);
      const currency = element.attr('currency')??'';
      const device = element.attr('device')??'';
      this.drillDownCurrency(currency, device);
    });

    $(grid.nativeElement).find('a[grand-total]').on('click', () => {
      this.showGrandTotal();
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private showGrandTotal() {
    const filterModel = this.modeContext.filterModel;
    const queryModel = this.modelService.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);
    this.grandTotalService.query('device/data-with-drilldown', queryModel).subscribe(gridOptions => {
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

  private drillDownCurrency(currency: string, device: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = currency;
    filterModel.device = device;
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    const modeContext = ModeContext.create("Device", filterModel, true);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: QueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      if (this.gridService.hasCurrencyColumn()) {
        this.updateCurrencyColumn(gridOptions);
      }
      this.updateGrandTotal(gridOptions);
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

  private updateGrandTotal(gridOptions: GridOptions) {
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
          const device = rowAttribute.groupId;
          // tslint:disable-next-line:max-line-length
          column.value = `<a href="javascript:;" drill-down-currency currency="${currency}" device="${device}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private excel(queryModel: QueryModel) {
    const gridModel = this.modeContext.gridModel;
    this.deviceService.excel(queryModel, gridModel.isDrillDownCurrency)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: QueryModel) {
    this.grandTotalService.excel('device/excel-with-drilldown', queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: QueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    const gridModel = this.modeContext.gridModel;
    this.deviceService.query(queryModel, gridModel.isDrillDownCurrency).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
