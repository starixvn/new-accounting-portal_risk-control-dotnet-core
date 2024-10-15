import { Component, ElementRef, OnInit } from '@angular/core';
import { GridModel, ModeGenerate, RowAttribute } from '../mode.model';
import { HeadlineService } from './headline.service';
import { GridService, ModelService, TitleService } from '../common';
import { ModalService } from 'components/modal';
import { ModeContext } from '../mode-context';
import { ModeController } from '../mode-controller';
import * as _ from 'lodash';
import { QueryModel } from 'app/app.model';
import { FilterConfig } from 'app/filter/filter.config';
import { Helper } from 'nap-components/helper';
import { LocalStorageKey } from 'app/common/constants';
import { FilterModel } from '../../filter/filter.model';
import { GridModalComponent } from 'components/grid-modal';

@Component({
  selector: 'app-headline',
  templateUrl: '../grid.html',
  providers: [
    HeadlineService,
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
    $(grid.nativeElement).find('a[drill-down-headline]').on('click', (event) => {
      const element = $(event.target);
      const headline = parseInt(element.attr('headline')!, 10);
      const userName = element.attr('username')!;
      this.drillDownHeadline(headline, userName);
    });

    $(grid.nativeElement).find('a[drill-down-currency]').on('click', (event) => {
      const element = $(event.target);
      const currency = parseInt(element.attr('currency')!, 10);
      const custId = parseInt(element.attr('custid')!, 10);
      const userName = element.attr('username')!;
      const roleId = parseInt(element.attr('roleId')!, 10);
      this.drillDownCurrency(currency, custId, userName, roleId);
    });

    $(grid.nativeElement).find('a[grand-total]').on('click', () => {
      this.showGrandTotal();
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  private drillDownHeadline(headline: number, userName: string) {
    const gridModel = new GridModel(false);
    const filterModel = this.createFilterModel();
    filterModel.headline = headline;
    const modeContext = ModeContext.create(userName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private createFilterModel(): FilterModel {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    return filterModel;
  }

  private drillDownCurrency(currency: number, custId: number, userName: string, roleId: number) {
    const gridModel = new GridModel(true);
    const filterModel = this.createFilterModel();
    filterModel.currency = [currency];
    filterModel.custId = custId;
    filterModel.roleId = roleId;
    const modeContext = ModeContext.create(userName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private showGrandTotal() {
    const queryModel = this.modelService.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);
    const queryHandler = (gridOptions: GridOptions) => {
      gridOptions.fullHeight = false;
      gridOptions.gridHeight = 500;
      gridOptions.titleInfo = {
        text: gridOptions.titleInfoText,
        showExcelButton: true,
        exportExcelFunction: () => this.excelGrandTotal(queryModel)
      };
      this.modalService.open(GridModalComponent, { size: { width: 1200 } }, gridOptions);
    };
    this.headlineService.query(queryModel).subscribe(queryHandler);
  }

  private excelGrandTotal(queryModel: QueryModel) {
    const queryHandler = (response: Blob) => {
      const fileName = this.titleService.getExcelGrandTotalFileName();
      Helper.downloadFile(response, fileName);
    };
    this.headlineService.excel(queryModel).subscribe(queryHandler);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: QueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      this.updateHeadlineColumn(gridOptions);
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

  private updateHeadlineColumn(gridOptions: GridOptions) {
    gridOptions.bodyRows.forEach(row => {
      if (!gridOptions.showTree) {
        const column = row.columns[0];
        const value = row.columns[1].value;
        const userName = row.columns[0].value
        column.value = `<a href="javascript:;" drill-down-headline username="${userName}" headline="${value}">${column.value}</a>`;
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
          const custId = rowAttribute.custId;
          const userName = rowAttribute.userName;
          const currency = column.customAttr;
          const roleId = rowAttribute.roleId;
          column.value = `<a href="javascript:;" drill-down-currency roleid="${roleId}" username="${userName}" custid="${custId}" currency="${currency}">${column.value}</a>`;
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
