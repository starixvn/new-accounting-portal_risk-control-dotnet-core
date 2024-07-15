import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { FilterConfig } from '../../filter';
import { QueryModel } from '../../app.model';
import { GrandTotalService, ModelService, TitleService, GridService } from '../common';
import { CompanyService } from './company.service';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { ModeController } from '../mode-controller';
import { LocalStorageKey } from 'app/common/constants';

@Component({
  selector: 'nap-company',
  templateUrl: '../grid.html',
  providers: [
    CompanyService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class CompanyComponent implements OnInit, ModeGenerate {
  gridOptions: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly companyService: CompanyService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.modelService.createQueryModel();
    if (_.isNil(gridOptions)) {
      const gridModel = this.modeContext.gridModel;
      this.companyService.query(queryModel, gridModel.isDrillDownCurrency).subscribe(result => {
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
      const currency = parseInt(element.attr('currency'), 10);
      const company = element.attr('company');
      this.drillDownCurrency(currency, company);
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

  private drillDownCurrency(currency: number, company: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = [currency];
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    if (company === 'Credit Group' && !_.isEqual(filterModel.sites, ['All'])
      || company === 'Licensee Group' && !_.isEqual(filterModel.sites, ['All'])) {
      filterModel.sites.push(company);
    } else {
      filterModel.sites = [company];
    }
    const modeContext = ModeContext.create(company, filterModel, true);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: QueryModel, isBack: boolean) {
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
    const rows = gridOptions.bodyRows;
    this.updateCurrencyColumnInRows(rows);
  }

  private updateCurrencyColumnInRows(rows: Row[]) {
    const currencyColumn = FilterConfig.gridColumns.currency;
    rows.forEach(row => {
      const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
      const company = rowAttribute.groupName;
      for (const column of row.columns) {
        if (column.name === currencyColumn.value) {
          const currency = column.customAttr;
          // tslint:disable-next-line:max-line-length
          column.value = `<a href="javascript:;" drill-down-currency currency="${currency}" company="${company}">${column.value}</a>`;
          break;
        }
      }

      const subRows = row.subRows;
      if (!_.isNil(subRows)) {
        this.updateCurrencyColumnInRows(subRows);
      }
    });
  }

  private excel(queryModel: QueryModel) {
    const gridModel = this.modeContext.gridModel;
    this.companyService.excel(queryModel, gridModel.isDrillDownCurrency)
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
    const gridModel = this.modeContext.gridModel;
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    localStorage.setItem(LocalStorageKey.SORT, `${queryModel.sortColumnName}**${queryModel.sortDirection}**${localStorage.getItem(LocalStorageKey.REPORT_TYPE)}`);
    this.companyService.query(queryModel, gridModel.isDrillDownCurrency).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
