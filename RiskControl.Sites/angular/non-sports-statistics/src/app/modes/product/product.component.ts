import { ProductSportBettypeSetting } from './product-sport-bettype-setting';
import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { FilterConfig, FilterHelper, FilterModel, Product, ReportType } from '../../filter';
import { BaseQueryModel } from '../../app.model';
import { CasinoType, GameTypeId, ProductId } from '../../common';
import { GrandTotalService, ModelService, TitleService, GridService } from '../common';
import { RowAttribute, ModeGenerate } from '../index';
import { ModeController } from '../mode-controller';
import { ModeContext } from '../mode-context';
import { ProductGridModel, CasinoProductQueryModel, ProductLevel } from './product.model';
import { ProductService } from './product.service';
import { ProductSetting } from './product-setting';
import { CasinoProductService } from './casino-product.service';
import { CasinoSetting } from './casino-setting';
import { LiveCasinoSetting } from './live-casino-setting';
import { RNGCasinoSetting } from './rng-casino-setting';
import { NumberGameSetting } from './number-game-setting';
import { VirtualSportsSetting } from './virtual-sports-setting';
import { KenoSetting } from './keno-setting';
import { ProductDetailRngCasinoSetting } from './product-detail-rng-casino-setting';
import { ProductDetailLiveCasinoSetting } from './product-detail-live-casino-setting';
import { LocalStorageKey } from 'app/common/constants';
import { ProductGroupSetting } from './product-group-setting';

@Component({
  selector: 'nap-product',
  templateUrl: '../grid.html',
  providers: [
    ProductService,
    CasinoProductService,
    GrandTotalService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class ProductComponent implements OnInit, ModeGenerate {
  gridOptions: GridOptions;

  constructor(
    private readonly modeContext: ModeContext,
    private readonly productService: ProductService,
    private readonly casinoProductService: CasinoProductService,
    private readonly grandTotalService: GrandTotalService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService,
    private readonly modalService: ModalService,
    private readonly modeController: ModeController
  ) { }

  ngOnInit() {
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
        this.productService.query(queryModel).subscribe(queryHandler);
      }
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    $(grid.nativeElement).find('a[drill-down-product]').on('click', (event) => {
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

  private createQueryModel(): BaseQueryModel {
    const queryModel = this.modelService.createQueryModel();
    const gridModel = this.modeContext.gridModel;
    if (gridModel instanceof ProductGridModel) {
      const prefix = gridModel.productSetting.typeName;
      queryModel.title = this.titleService.getTitleWithPrefix(prefix);
    }

    queryModel.reportBy += this.getReportBySuffix();
    if (!this.isReportByOfProductDetailOrProduct(queryModel.reportBy)) {
      queryModel.sortColumnName = '';
      queryModel.sortDirection = '';
    }
    return queryModel;
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

  private drillDownProduct(typeId: number, typeName: string) {
    const gridModel = this.createGridModel(false, typeId, typeName);
    const filterModel = this.createFilterModel(gridModel);
    const modeContext = ModeContext.create(typeName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownCurrency(currency: number, typeId: number, typeName: string) {
    const gridModel = this.createGridModel(true, typeId, typeName);
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
      const productCategory = gridModel.productSetting.productCategory;
      const casinoProductIds = filterModel.selectedCollection.products
        .filter(product => product.productCategory === productCategory)
        .map(product => product.productId);
      filterModel.productIds = _.intersection(filterModel.productIds, casinoProductIds);
    } else {
      gridModel.productSetting.updateFilterModel(filterModel);
    }

    return filterModel;
  }

  private createGridModel(isDrillDownCurrency: boolean, typeId: number, typeName: string): ProductGridModel {
    let productSetting: ProductSetting;
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel;
    if (gridModel instanceof ProductGridModel) {
      if (gridModel.productSetting.levels.length > 1) {
        productSetting = _.cloneDeep(gridModel.productSetting);
        productSetting.drillDown(isDrillDownCurrency, typeId, typeName);
      } else {
        productSetting = this.getProductDetailProductSetting(typeId, typeName, filterModel);
      }
      
    } else {
      if (filterModel.reportType === ReportType.ProductDetail) {
        productSetting = this.getProductDetailProductSetting(typeId, typeName, filterModel);
      }
      else {
        productSetting = new ProductGroupSetting(typeId, typeName);
      }
    }

    return new ProductGridModel(isDrillDownCurrency, productSetting);
  }

  private getProductDetailProductSetting(typeId: number, typeName: string, filterModel: FilterModel): ProductSetting {
    if (ProductId.NumberGame === typeId) {
      return new NumberGameSetting(typeId, typeName);
    } else {
      const casinoProduct = this.getCasinoProduct(filterModel.collection.products, typeId);
      let productSetting: ProductSetting;
      if (!_.isNil(casinoProduct)) {
        productSetting = casinoProduct.casinoType === CasinoType.RNG
          ? new ProductDetailRngCasinoSetting(typeId, typeName) : new ProductDetailLiveCasinoSetting(typeId, typeName);
      } else {
        const filterGameTypes = filterModel.selectedCollection.gameTypes.filter(gameType => gameType.productId === typeId);
        const gameTypeId: GameTypeId = filterGameTypes[0].gameType;

        if (gameTypeId === GameTypeId.SportType) {
          productSetting = new VirtualSportsSetting(typeId, typeName);
        }

        if (gameTypeId === GameTypeId.BetType) {
          productSetting = new KenoSetting(typeId, typeName);
        }
      }
      return productSetting;
    }
  }

  private hasDrillDownProduct() {
    const gridModel = this.modeContext.gridModel;
    if (gridModel instanceof ProductGridModel) {
      return gridModel.productSetting.hasDrillDownProduct();
    }

    return true;
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: BaseQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      this.updateGrandTotalCell(gridOptions);
      if (this.gridService.hasCurrencyColumn()) {
        this.updateCurrencyColumn(gridOptions);
      }
      if (this.hasDrillDownProduct()) {
        this.updateProductColumn(gridOptions);
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
    const reportByColumnName = gridOptions.columns[0].name;
    gridOptions.bodyRows.forEach(row => {
      const column = row.columns[0];
      if (column.name === reportByColumnName) {
        const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
        const typeId = rowAttribute.groupId;
        const typeName = rowAttribute.groupName;
        column.value = `<a href="javascript:;" drill-down-product type-id="${typeId}" type-name="${typeName}">${column.value}</a>`;
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
          const typeId = rowAttribute.groupId;
          const typeName = rowAttribute.groupName;
          // tslint:disable-next-line:max-line-length
          column.value = `<a href="javascript:;" drill-down-currency currency="${currency}" type-id="${typeId}" type-name="${typeName}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private updateGrandTotalCell(gridOptions: GridOptions) {
    const row = gridOptions.footerRows[0];
    const column = row.columns[0];
    const value = column.value;
    column.value = `<a href="javascript:;" grand-total>${value}</a>`;
  }

  private excel(queryModel: BaseQueryModel) {
    const gridModel = this.modeContext.gridModel;
    const queryHandler = (response: Blob) => {
      const fileName = this.titleService.getExcelFileName();
      Helper.downloadFile(response, fileName);
    };
    if (gridModel instanceof ProductGridModel
      && gridModel.productSetting instanceof CasinoSetting
      && gridModel.productSetting.isViewSubProduct(gridModel.isDrillDownCurrency)) {
      const casinoProductQueryModel = queryModel as CasinoProductQueryModel;
      casinoProductQueryModel.casinoType = gridModel.productSetting.casinoType;
      this.casinoProductService.excel(casinoProductQueryModel).subscribe(queryHandler);
    } else {
      this.productService.excel(queryModel).subscribe(queryHandler);
    }
  }

  private excelGrandTotal(queryModel: BaseQueryModel) {
    const gridModel = this.modeContext.gridModel;
    const queryHandler = (response: Blob) => {
      const fileName = this.titleService.getExcelGrandTotalFileName();
      Helper.downloadFile(response, fileName);
    };
    if (gridModel instanceof ProductGridModel
      && gridModel.productSetting instanceof CasinoSetting
      && gridModel.productSetting.isViewSubProduct(gridModel.isDrillDownCurrency)) {
      const casinoProductQueryModel = queryModel as CasinoProductQueryModel;
      casinoProductQueryModel.casinoType = gridModel.productSetting.casinoType;
      this.casinoProductService.excelGrandTotal(casinoProductQueryModel).subscribe(queryHandler);
    } else {
      const filterModel = this.modeContext.filterModel;
      this.grandTotalService.excel(filterModel.reportType, queryModel).subscribe(queryHandler);
    }
  }

  private sort(queryModel: BaseQueryModel, sortColumnName: string, sortDirection: string) {
    const gridModel = this.modeContext.gridModel;
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    if (this.isReportByOfProductDetailOrProduct(queryModel.reportBy)) {
      localStorage.setItem(LocalStorageKey.SORT, `${queryModel.sortColumnName}**${queryModel.sortDirection}**${localStorage.getItem(LocalStorageKey.REPORT_TYPE)}`);
    }
    const queryHandler = (gridOptions: GridOptions) => {
      this.updateGridOptions(gridOptions, queryModel, false);
    };
    if (gridModel instanceof ProductGridModel
      && gridModel.productSetting instanceof CasinoSetting
      && gridModel.productSetting.isViewSubProduct(gridModel.isDrillDownCurrency)) {
      const casinoProductQueryModel = queryModel as CasinoProductQueryModel;
      casinoProductQueryModel.casinoType = gridModel.productSetting.casinoType;
      this.casinoProductService.query(casinoProductQueryModel).subscribe(queryHandler);
    } else {
      this.productService.query(queryModel).subscribe(queryHandler);
    }
  }

  private getCasinoProduct(products: Product[], productId: number): Product {
    const liveRngCasionList = products.filter(p => p.casinoType === CasinoType.RNG || p.casinoType === CasinoType.SLI);
    return liveRngCasionList.find(p => p.productId === productId);
  }

  private isReportByOfProductDetailOrProduct(reportBy: string): boolean {
    return reportBy === 'ProductDetail' || reportBy === 'Product';
  }
}
