import { ModeController } from '../mode-controller';
import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { ModelService, TitleService, GridService } from '../common';
import { SportService } from './sport.service';
import { SportQueryModel, SportGridModel } from './sport.model';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { GrandTotalService } from '../common/grand-total.service';
import { FilterConfig } from '../../filter/filter.config';
import { DrillDownConstants } from '../../common/constants';

@Component({
  selector: 'nap-sport',
  templateUrl: '../grid.html',
  providers: [
    SportService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class SportComponent implements OnInit, ModeGenerate {
  gridOptions!: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly sportService: SportService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.sportService.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    $(grid.nativeElement).find(`a[${DrillDownConstants.DRILL_DOWN_CURRENCY}]`).on('click', (event) => {
      const element = $(event.target);
      const currency = element.attr('currency')??'';
      const data = element.attr('data')??'';
      this.drillDownCurrency(currency, data, element[0].innerText);
    });

    $(grid.nativeElement).find(`a[${DrillDownConstants.GRAND_TOTAL}]`).on('click', () => {
      this.showGrandTotal();
    });

    $(grid.nativeElement).find(`a[${DrillDownConstants.DRILL_DOWN_SPORT}]`).on('click', (event) => {
      const element = $(event.target);
      const sport = element.attr('data')??'';
      this.drillDownSport(element[0].innerText, sport);
    });

    $(grid.nativeElement).find(`a[${DrillDownConstants.DRILL_DOWN_LEAGUE}]`).on('click', (event) => {
      const element = $(event.target);
      const league = element.attr('data')??'';
      this.drillDownLeague(element[0].innerText, league);
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private createQueryModel(): SportQueryModel {
    const gridModel = this.modeContext.gridModel;
    const queryModel = this.modelService.createQueryModel();
    
    return Helper.extend(queryModel, {
      isDrillDownSport: gridModel instanceof SportGridModel && gridModel.isDrillDownSport,
      isDrillDownLeague: gridModel instanceof SportGridModel && gridModel.isDrillDownLeague
    });
  }

  private showGrandTotal() {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel;
    const queryModel = this.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);
    if (gridModel instanceof SportGridModel) {
      queryModel.isDrillDown = false;
    }
    queryModel.title = this.titleService.getGrandTotalByCurrencyTitle();
    const endPoint = this.sportService.getApiEndpoint(queryModel, true);
    this.grandTotalService.query(endPoint, queryModel).subscribe(gridOptions => {
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

  private drillDownCurrency(currency: string, data: string, title: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = currency;

    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    const isDrillDownSport = filterModel.headerText === "League";
    const isDrillDownLeague = filterModel.headerText === "Bet Type";
    if (isDrillDownSport) {
      filterModel.leagueId = data;
    } else if (isDrillDownLeague) {
      filterModel.sportBettype = filterModel.sportBettype.split(',').filter(x => x.split('-')[1] === data).join(',');
    } else {
      filterModel.sportBettype = filterModel.sportBettype.split(',').filter(x => x.split('-')[0] === data).join(',');
    }
    const modeContext = ModeContext.create(title, filterModel, new SportGridModel(true, isDrillDownSport, isDrillDownLeague));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownSport(title: string, sport: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.sportBettype = filterModel.sportBettype.split(',').filter(x => x.split('-')[0] === sport).join(',');
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    filterModel.headerText = 'League';
    const modeContext = ModeContext.create(title, filterModel, new SportGridModel(false, true, false));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownLeague(title: string, leagueId: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.leagueId = leagueId;
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    filterModel.headerText = 'Bet Type'
    const modeContext = ModeContext.create(title, filterModel, new SportGridModel(false, true, true));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: SportQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      if (!queryModel.isDrillDownSport) { 
        this.updateReportByColumn(gridOptions, DrillDownConstants.DRILL_DOWN_SPORT);
      }

      if (queryModel.isDrillDownSport && !queryModel.isDrillDownLeague) {
        this.updateReportByColumn(gridOptions, DrillDownConstants.DRILL_DOWN_LEAGUE);
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
    column.value = `<a href="javascript:;" ${DrillDownConstants.GRAND_TOTAL}>${value}</a>`;
  }

  private updateReportByColumn(gridOptions: GridOptions, drillDownType: string) {
    const sportColumn = FilterConfig.gridColumns.reportBy;
    gridOptions.bodyRows.forEach(row => {
      const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
      for (const column of row.columns) {
        if (column.name === sportColumn.value) {
          const data = rowAttribute.groupName;
          column.value = `<a href="javascript:;" ${drillDownType} data="${data}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private updateCurrencyColumn(gridOptions: GridOptions) {
    const currencyColumn = FilterConfig.gridColumns.currency;
    gridOptions.bodyRows.forEach(row => {
      const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
      for (const column of row.columns) {
        if (column.name === currencyColumn.value) {
          const currency = column.customAttr;
          const data = rowAttribute.groupName;
          column.value = `<a href="javascript:;" ${DrillDownConstants.DRILL_DOWN_CURRENCY} currency="${currency}" data="${data}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private excel(queryModel: SportQueryModel) {
    this.sportService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: SportQueryModel) {
    const endPoint = this.sportService.getApiEndpoint(queryModel, false);
    const filterModel = this.modeContext.filterModel;
    this.grandTotalService.excel(endPoint, queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: SportQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.sportService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
