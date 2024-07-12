import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from 'nap-components/helper';
import { DateHelper } from 'nap-components/date';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { DATE_CONFIG } from '../../common';
import { FilterConfig, ReportType } from '../../filter';
import { QueryModel } from '../../app.model';
import { GrandTotalService, ModelService, TitleService, GridService } from '../common';
import { MonthlyService } from './monthly.service';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { ModeController } from '../mode-controller';
import { LocalStorageKey } from 'app/common/constants';

@Component({
  selector: 'nap-monthly',
  templateUrl: '../grid.html',
  providers: [
    MonthlyService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class MonthlyComponent implements OnInit, ModeGenerate {
  gridOptions: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly monthlyService: MonthlyService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.modelService.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.monthlyService.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    $(grid.nativeElement).find('a[drill-down-daily]').on('click', (event) => {
      const element = $(event.target);
      const monthText = element.attr('month');
      const month = DateHelper.convertStringToMomentDate(monthText, DATE_CONFIG.dateMonthFormatString);
      this.drillDownDaily(monthText, month);
    });

    $(grid.nativeElement).find('a[drill-down-currency]').on('click', (event) => {
      const element = $(event.target);
      const currency = parseInt(element.attr('currency'), 10);
      const dateText = element.attr('date');
      const date = DateHelper.convertStringToMomentDate(dateText, DATE_CONFIG.dateMonthFormatString);
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

  private showGrandTotal() {
    const filterModel = this.modeContext.filterModel;
    const queryModel = this.modelService.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);
    this.grandTotalService.query(filterModel.reportType, queryModel).subscribe(gridOptions => {
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

  private drillDownDaily(title: string, date: moment.Moment) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.Daily;
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    filterModel.startDate = moment.max(moment.utc(date).startOf('month'), filterModel.startDate);
    filterModel.endDate = moment.min(moment.utc(date).endOf('month'), filterModel.endDate);
    const modeContext = ModeContext.create(title, filterModel, false);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownCurrency(title: string, currency: number, date: moment.Moment) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = [currency];
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    filterModel.startDate = moment.max(moment.utc(date).startOf('month'), filterModel.startDate);
    filterModel.endDate = moment.min(moment.utc(date).endOf('month'), filterModel.endDate);
    const modeContext = ModeContext.create(title, filterModel, true);
    this.modeController.forward(this.gridOptions, modeContext);
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
      if (column.name === FilterConfig.gridColumns.reportBy.value) {
        column.value = `<a href="javascript:;" drill-down-daily month="${column.value}">${column.value}</a>`;
      }
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
    this.monthlyService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: QueryModel) {
    const filterModel = this.modeContext.filterModel;
    this.grandTotalService.excel(filterModel.reportType, queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: QueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    localStorage.setItem(LocalStorageKey.SORT, `${queryModel.sortColumnName}**${queryModel.sortDirection}**${localStorage.getItem(LocalStorageKey.REPORT_TYPE)}`);
    this.monthlyService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
