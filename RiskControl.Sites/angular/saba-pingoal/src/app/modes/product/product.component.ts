import { ModeController } from './../mode-controller';
import { Component, ElementRef, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { ModelService, TitleService, GridService } from '../common';
import { ProductService } from './product.service';
import { ProductQueryModel, ProductGridModel } from './product.model';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { GrandTotalService } from '../common/grand-total.service';
import { ReportType } from '../../filter/filter.model';
import { FilterConfig } from '../../filter/filter.config';

@Component({
  selector: 'nap-product',
  templateUrl: '../grid.html',
  providers: [
    ProductService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class ProductComponent implements OnInit, ModeGenerate {
  gridOptions!: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly productService: ProductService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.productService.query(queryModel).subscribe(result => {
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
      const sportText = element.attr('sport')??'';
      this.drillDownCurrency(currency, sportText);
    });

    $(grid.nativeElement).find('a[grand-total]').on('click', () => {
      this.showGrandTotal();
    });

    $(grid.nativeElement).find('a[drill-down-sport]').on('click', (event) => {
      const element = $(event.target);
      const sportText = element.attr('sport')??'';
      this.drillDownSport("Sport", sportText);
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private createQueryModel(): ProductQueryModel {
    const gridModel = this.modeContext.gridModel;
    const queryModel = this.modelService.createQueryModel();
    
    return Helper.extend(queryModel, {
      isDrillDownSport: gridModel instanceof ProductGridModel && gridModel.isDrillDownSport
    });
  }

  private showGrandTotal() {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel;
    const queryModel = this.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);
    if (gridModel instanceof ProductGridModel) {
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

  private drillDownCurrency(currency: string, sport: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = currency;

    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    const isDrillDownSport = filterModel.headerText === "League";
    let title = 'Sport';
    if (isDrillDownSport) {
      const sportType = filterModel.sportBettype.split('-')[0].split(',')[0];
      title = filterModel.sportList?.find(x => x.sportType.toString() === sportType)?.sportName ?? 'Sport';
    } else {
      filterModel.sportBettype = filterModel.sportBettype.split(',').filter(x => x.split('-')[0] === sport).join(',');
    }
    const modeContext = ModeContext.create(title, filterModel, new ProductGridModel(true, isDrillDownSport));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownSport(title: string, sport: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.sportBettype = filterModel.sportBettype.split(',').filter(x => x.split('-')[0] === sport).join(',');
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    filterModel.headerText = 'League'
    const modeContext = ModeContext.create(title, filterModel, new ProductGridModel(false, true));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: ProductQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      if (!queryModel.isDrillDownSport) {
        this.updateSportColumn(gridOptions);
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

  private updateSportColumn(gridOptions: GridOptions) {
    const sportColumn = FilterConfig.gridColumns.reportBy;
    gridOptions.bodyRows.forEach(row => {
      const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
      for (const column of row.columns) {
        if (column.name === sportColumn.value) {
          const sport = rowAttribute.groupName;
          column.value = `<a href="javascript:;" drill-down-sport sport="${sport}">${column.value}</a>`;
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
          const sport = rowAttribute.groupName;
          column.value = `<a href="javascript:;" drill-down-currency currency="${currency}" sport="${sport}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private excel(queryModel: ProductQueryModel) {
    this.productService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: ProductQueryModel) {
    const filterModel = this.modeContext.filterModel;
    this.grandTotalService.excel(filterModel.reportType as ReportType, queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: ProductQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.productService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
