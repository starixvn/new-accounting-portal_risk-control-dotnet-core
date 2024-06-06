import { Component, ElementRef, OnInit } from '@angular/core';
import { ProductDetailService } from './product-detail.service';
import { GrandTotalService, GridService, ModelService, TitleService } from '../common';
import { ModeGenerate, RowAttribute } from '../mode.model';
import { ModeContext } from '../mode-context';
import { ModalService } from 'components/modal';
import { ModeController } from '../mode-controller';
import { QueryModel } from 'app/app.model';
import { FilterConfig, FilterModel } from 'app/filter';
import { Helper } from 'nap-components/helper';
import { ProductSportBettypeSetting } from '../product/product-sport-bettype-setting';
import { NumberGameSetting } from '../product/number-game-setting';
import { RNGCasinoSetting } from '../product/rng-casino-setting';
import { LiveCasinoSetting } from '../product/live-casino-setting';
import { CasinoType, GameTypeId, ProductId } from 'app/common';
import { VirtualSportsSetting } from '../product/virtual-sports-setting';
import { KenoSetting } from '../product/keno-setting';
import { CasinoProductQueryModel, ProductGridModel, ProductLevel } from '../product/product.model';
import { ProductSetting } from '../product/product-setting';
import { CasinoSetting } from '../product/casino-setting';
import { GridModalComponent } from 'components/grid-modal';
import { CasinoProductService } from '../product/casino-product.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-detail',
  templateUrl: '../grid.html',
  providers: [
    ProductDetailService,
    CasinoProductService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class ProductDetailComponent implements OnInit, ModeGenerate {

  gridOptions: GridOptions;

  constructor(
    private readonly modeContext: ModeContext,
    private readonly productDetailService: ProductDetailService,
    private readonly grandTotalService: GrandTotalService,
    private readonly casinoProductService: CasinoProductService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService,
    private readonly modalService: ModalService,
    private readonly modeController: ModeController
  ) { }

  ngOnInit(): void {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      const gridModel = this.modeContext.gridModel;
      const queryHandler = (result: GridOptions) => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      };
      if (gridModel instanceof ProductGridModel
        && gridModel.productSetting instanceof CasinoSetting
        && gridModel.productSetting.isViewSubProduct(gridModel.isDrillDownCurrency)) {
        const casinoProductQueryModel: CasinoProductQueryModel = Helper.extend(queryModel, {
          casinoType: gridModel.productSetting.casinoType
        });
        this.casinoProductService.query(casinoProductQueryModel).subscribe(queryHandler);
      } else {
        this.productDetailService.query(queryModel).subscribe(queryHandler);
      }
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef): void {
    $(grid.nativeElement).find('a[drill-down-product-detail]').on('click', (event) => {
      const element = $(event.target);
      const typeId = parseInt(element.attr('type-id'), 10);
      const typeName = element.attr('type-name');
      this.drillDownProduct(typeId, typeName);
    });

    $(grid.nativeElement).find('a[drill-down-currency]').on('click', (event) => {
      const element = $(event.target);
      const currency = parseInt(element.attr('currency'), 10);
      const typeId = parseInt(element.attr('type-id'), 10);
      const typeName = element.attr('type-name');
      this.drillDownCurrency(currency, typeId, typeName);
    });

    $(grid.nativeElement).find('a[grand-total]').on('click', () => {
      this.showGrandTotal();
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }
  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitleForReportProduct(isLast);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: QueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      this.updateProductColumn(gridOptions);
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

  private updateProductColumn(gridOptions: GridOptions) {
    gridOptions.bodyRows.forEach(row => {
      const column = row.columns[0];
      if (column.name === FilterConfig.gridColumns.reportBy.value) {
        column.value = `<a href="javascript:;" drill-down-product-detail product="${column.value}">${column.value}</a>`;
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
    this.productDetailService.excel(queryModel)
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
    this.productDetailService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }

  private drillDownProduct(typeId: number, typeName: string) {
    const isNormalMode = this.modeContext.filterModel.isNormalMode;
    const gridModel = this.createGridModel(false, isNormalMode, typeId, typeName);
    const filterModel = this.createFilterModel(gridModel);
    const modeContext = ModeContext.create(typeName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownCurrency(currency: number, typeId: number, typeName: string) {
    const isNormalMode = this.modeContext.filterModel.isNormalMode;
    const gridModel = this.createGridModel(true, isNormalMode, typeId, typeName);
    const filterModel = this.createFilterModel(gridModel);
    filterModel.currency = [currency];
    const modeContext = ModeContext.create(typeName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private createFilterModel(gridModel: ProductGridModel): FilterModel {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    if (gridModel.productSetting instanceof CasinoSetting
      && gridModel.isDrillDownCurrency
      && gridModel.productSetting.level === ProductLevel.CasinoTypeViewProduct) {
      const casinoType = gridModel.productSetting.casinoType;
      const casinoProductIds = filterModel.selectedCollection.products
        .filter(product => product.casinoType === casinoType)
        .map(product => product.productId);
      filterModel.productIds = _.intersection(filterModel.productIds, casinoProductIds);
    } else {
      gridModel.productSetting.updateFilterModel(filterModel);
    }

    return filterModel;
  }

  private createGridModel(isDrillDownCurrency: boolean, isNormalMode: boolean, typeId: number, typeName: string): ProductGridModel {
    let productSetting: ProductSetting;
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel;
    if (gridModel instanceof ProductGridModel) {
      productSetting = _.cloneDeep(gridModel.productSetting);
      productSetting.drillDown(isDrillDownCurrency, typeId, typeName);
    } else {
      const RNGCasinoTypeId = 1;
      const LiveCasinoTypeId = 2;
      switch (typeId) {
        case LiveCasinoTypeId:
          productSetting = new LiveCasinoSetting(CasinoType.SLI, typeName);
          break;
        case RNGCasinoTypeId:
          productSetting = new RNGCasinoSetting(CasinoType.RNG, typeName);
          break;
        case ProductId.NumberGame:
          productSetting = new NumberGameSetting(typeId, typeName);
          break;
        case ProductId.SabaClub:
          productSetting = new ProductSportBettypeSetting(typeId, typeName);
          break;
        case ProductId.VGaming:
          productSetting = new ProductSportBettypeSetting(typeId, typeName);
          break;
        default:
          // tslint:disable-next-line:max-line-length
          const filterGameTypes = filterModel.selectedCollection.gameTypes.filter(gameType => gameType.productId === typeId);
          const gameTypeId: GameTypeId = filterGameTypes[0].gameType;

          if (gameTypeId === GameTypeId.SportType) {
            productSetting = new VirtualSportsSetting(typeId, typeName);
          }

          if (gameTypeId === GameTypeId.BetType) {
            productSetting = new KenoSetting(typeId, typeName);
          }
          break;
      }
    }

    return new ProductGridModel(isDrillDownCurrency, productSetting);
  }

  private showGrandTotal() {
    const gridModel = this.modeContext.gridModel;
    const queryModel = this.createQueryModel();
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
    if (gridModel instanceof ProductGridModel
      && gridModel.productSetting instanceof CasinoSetting
      && gridModel.productSetting.isViewSubProduct(gridModel.isDrillDownCurrency)) {
      const casinoProductQueryModel = queryModel as CasinoProductQueryModel;
      casinoProductQueryModel.casinoType = gridModel.productSetting.casinoType;
      this.casinoProductService.queryGrandTotal(casinoProductQueryModel).subscribe(queryHandler);
    } else {
      const filterModel = this.modeContext.filterModel;
      this.grandTotalService.query(filterModel.reportType, queryModel).subscribe(queryHandler);
    }
  }

  private getReportBySuffix(): string {
    const gridModel = this.modeContext.gridModel;
    if (gridModel instanceof ProductGridModel) {
      return gridModel.productSetting.getReportBySuffix(gridModel.isDrillDownCurrency);
    }

    return '';
  }

  private createQueryModel(): QueryModel {
    const queryModel = this.modelService.createQueryModel();
    const gridModel = this.modeContext.gridModel;
    if (gridModel instanceof ProductGridModel) {
      const prefix = gridModel.productSetting.typeName;
      queryModel.title = this.titleService.getTitleWithPrefix(prefix);
    }

    queryModel.reportBy += this.getReportBySuffix();
    return queryModel;
  }
}
