import { ModeController } from './../mode-controller';
import { Component, ElementRef, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { DateHelper } from 'nap-components/date';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { FilterConfig, FilterModel, ReportType } from '../../filter';
import { HourlyGridModel } from '../hourly';
import { GrandTotalService, ModelService, TitleService, GridService } from '../common';
import { DailyService } from './daily.service';
import { DailyQueryModel, DailyGridModel } from './daily.model';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { DATE_CONFIG } from 'app/common';
import { LocalStorageKey } from 'app/common/constants';

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
  gridOptions: GridOptions;

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
    $(grid.nativeElement).find('a[drill-down-hourly]').on('click', (event) => {
      const element = $(event.target);
      const dateText = element.attr('date');
      const date = DateHelper.convertDateStructToMoment(DateHelper.convertStringToDateStruct(dateText));
      this.drillDownHourly(dateText, date);
    });

    $(grid.nativeElement).find('a[drill-down-currency]').on('click', (event) => {
      const element = $(event.target);
      const currency = parseInt(element.attr('currency'), 10);
      const dateText = element.attr('date');
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
    const gridModel = this.modeContext.gridModel;
    let usernameDrillDown = false;
    if (gridModel instanceof DailyGridModel) {
      usernameDrillDown = gridModel.isDrillDownFromUserName;
    }

    const queryModel = this.modelService.createQueryModel();

    return Helper.extend(queryModel, {
      usernameDrillDown: usernameDrillDown
    });
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

  private drillDownHourly(title: string, date: moment.Moment) {
    const yesterday = moment(DATE_CONFIG.reportDate.yesterday);

    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.Hourly;
    filterModel.startDate = date;
    filterModel.endDate = date;

    if (yesterday.isSameOrBefore(date)) {
      filterModel.isNormalMode = true;
    }

    let isDrillDownFromUserName = false;
    if (this.modeContext.gridModel instanceof DailyGridModel) {
      isDrillDownFromUserName = this.modeContext.gridModel.isDrillDownFromUserName;
    }
    const gridModel = new HourlyGridModel(false, isDrillDownFromUserName);
    const modeContext = ModeContext.create(title, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownCurrency(title: string, currency: number, date: moment.Moment) {
    const gridModel = this.modeContext.gridModel;
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = [currency];
    filterModel.startDate = date;
    filterModel.endDate = date;
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
      if (this.gridService.hasDrillDownHourly()) {
        this.updateDailyColumn(gridOptions);
      }

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

  private updateDailyColumn(gridOptions: GridOptions) {
    const existNumberGameLeague = this.checkExistNumberGameLeague();

    if (existNumberGameLeague) {
      gridOptions.bodyRows.forEach(row => {
        const dailyColumn = row.columns[0];
        const date = dailyColumn.value;
        dailyColumn.value = `<a href="javascript:;" drill-down-hourly date='${date}'>${date}</a>`;
      });
    }
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
    this.grandTotalService.excel(filterModel.reportType, queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: DailyQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    localStorage.setItem(LocalStorageKey.SORT, `${queryModel.sortColumnName}**${queryModel.sortDirection}**${localStorage.getItem(LocalStorageKey.REPORT_TYPE)}`);
    this.dailyService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }

  private checkExistNumberGameLeague(): boolean {
    const happyFiveLinkedGamesSportType = 168;
    const filterModel: FilterModel = _.cloneDeep(this.modeContext.filterModel);
    const leagues = filterModel.leagueIds;
    if(leagues.length === 0) {
      return true;
    }

    for (const element of leagues) {
      if (element.leagueId !== happyFiveLinkedGamesSportType) {
        return true;
      }
    }

    return false;
  }
}
