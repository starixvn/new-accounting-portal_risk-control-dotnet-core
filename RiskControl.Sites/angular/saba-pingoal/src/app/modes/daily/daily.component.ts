import { ModeController } from './../mode-controller';
import { Component, ElementRef, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { DateHelper } from 'nap-components/date';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { ModelService, TitleService, GridService } from '../common';
import { DailyService } from './daily.service';
import { DailyQueryModel, DailyGridModel } from './daily.model';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { GrandTotalService } from '../common/grand-total.service';
import { ReportType } from '../../filter/filter.model';
import { FilterConfig } from '../../filter/filter.config';

@Component({
  selector: 'nap-daily',
  templateUrl: '../grid.html',
  providers: [
    DailyService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class DailyComponent implements OnInit, ModeGenerate {
  gridOptions!: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly dailyService: DailyService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.dailyService.query(queryModel).subscribe(result => {
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
      const dateText = element.attr('date')??'';
      const date = DateHelper.convertDateStructToMoment(DateHelper.convertStringToDateStruct(dateText));
      this.drillDownCurrency(dateText, currency, date);
    });

    $(grid.nativeElement).find('a[grand-total]').on('click', () => {
      this.showGrandTotal();
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private createQueryModel(): DailyQueryModel {

    const queryModel = this.modelService.createQueryModel();

    return queryModel;
  }

  private showGrandTotal() {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel;
    const queryModel = this.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);
    if (gridModel instanceof DailyGridModel && gridModel.isDrillDownFromUserName) {
      queryModel.isDrillDown = false;
    }
    queryModel.title = this.titleService.getGrandTotalByCurrencyTitle();
    this.grandTotalService.query(filterModel.reportType as ReportType, queryModel).subscribe(gridOptions => {
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

  private drillDownCurrency(title: string, currency: string, date: moment.Moment) {
    const gridModel = this.modeContext.gridModel;
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = currency;
    filterModel.fromDate = date;
    filterModel.toDate = date;
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    let isDrillDownFromUserName = false;
    if (gridModel instanceof DailyGridModel) {
      isDrillDownFromUserName = gridModel.isDrillDownFromUserName;
    }
    const modeContext = ModeContext.create(title, filterModel, new DailyGridModel(true, isDrillDownFromUserName));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: DailyQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {

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

  private excel(queryModel: DailyQueryModel) {
    this.dailyService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: DailyQueryModel) {
    const filterModel = this.modeContext.filterModel;
    this.grandTotalService.excel(filterModel.reportType as ReportType, queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: DailyQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.dailyService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
