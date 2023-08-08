import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as numeral from 'numeral';
import { Helper } from 'nap-components/helper';
import { RoleId } from '../../common';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { FilterConfig, ReportType, CompareType, GameTypeModel, FilterHelper } from '../../filter';
import { ModeController } from '../mode-controller';
import { ModeContext } from '../mode-context';
import { ModeGenerate } from '../mode.model';
import { ModelService } from '../common/model.service';
import { TitleService } from '../common/title.service';
import { GridService } from '../common/grid.service';
import { DailyGridModel } from '../daily/daily.model';
import { HourlyGridModel } from '../hourly/hourly.model';
import { HousePositionTakingService } from '../house-position-taking/house-position-taking.service';
import { HousePositionTakingQueryModel } from '../house-position-taking/house-position-taking.model';
import { UserNameService } from './user-name.service';
import {
  UserNameBaseQueryModel, UserNameQueryModel, UserNameNormalQueryModel, isNormalQueryModel, UserNameGridModel
} from './user-name.model';
import { AssociatedAccountComponent } from '../associated-account/associated-account.component';

interface RowCustomAttribute {
  ReportBy: string;
  ReportById: number;
  SiteName: string;
  CurrencyId: number;
}

@Component({
  selector: 'nap-user-name',
  templateUrl: '../grid.html',
  providers: [
    UserNameService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class UserNameComponent implements OnInit, ModeGenerate {
  gridOptions: GridOptions;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly userNameService: UserNameService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService,
    private readonly housePositionTakingService: HousePositionTakingService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.userNameService.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    this.updateLinkAction(grid.nativeElement);
    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private updateLinkAction(gridElement: HTMLElement) {
    $(gridElement).find('a[drill-down-user-name]').on('click', (event) => {
      const element = $(event.target);
      const userName = element.attr('user-name');
      this.drillDownByUserName(userName);
    });

    $(gridElement).find('a[house-position-taking]').on('click', (event) => {
      const element = $(event.target);
      const custId = parseInt(element.attr('cust-id'), 10);
      const userName = element.attr('user-name');
      this.showHousePositionTaking(custId, userName);
    });

    $(gridElement).find('a[associated-account]').on('click', (event) => {
      const element = $(event.target);
      const userName = element.attr('user-name');
      const site = element.attr('site');
      const custId = parseInt(element.attr('cust-id'), 10);
      this.showAssociatedAccounts(userName, site, custId);
    });

    $(gridElement).find('a[grand-total]').on('click', () => {
      this.showGrandTotal();
    });
  }

  private createQueryModel(): UserNameQueryModel {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel as UserNameGridModel;
    const queryModel = this.modelService.createQueryModel() as UserNameQueryModel;
    queryModel.roleId = filterModel.roleId;
    queryModel.isDrillDown = gridModel.isDrillDownFromUserName;
    return queryModel;
  }

  private showHousePositionTaking(custId: number, userName: string) {
    const queryModel = this.createQueryModel();
    if (isNormalQueryModel(queryModel)) {
      const housePositionTakingQueryModel: HousePositionTakingQueryModel = {
        isNormalMode: queryModel.isNormalMode,
        winLostDate: queryModel.winlostDate,
        productId: queryModel.productId,
        custId: custId,
        betType: queryModel.betType,
        leagueId: queryModel.leagueId,
        sportType: queryModel.sportType,
        currency: queryModel.currency,
        device: queryModel.device,
        totalBetType: queryModel.totalBetType,
        totalBetValue: queryModel.totalBetValue,
        gameIncomeType: queryModel.gameIncomeType,
        gameIncomeValue: queryModel.gameIncomeValue,
        housePTType: queryModel.housePTType,
        housePTValue: queryModel.housePTValue,
        site: queryModel.site,
        excludeTest: queryModel.excludeTest,
        sportBettype: queryModel.sportBettype
      };
      this.housePositionTakingService.show(housePositionTakingQueryModel, userName);
    }
  }

  private showAssociatedAccounts(userName: string, site: string, custId: number) {
    const filterModel = this.modeContext.filterModel;
    let currency = FilterConfig.currencyBaseRM.toString();
    let currencyName = 'Base RM';
    if (!filterModel.isBaseRM) {
      currency = '0';
      currencyName = 'Original Currency';
    }
    const gameTypeModel: GameTypeModel = {
      products: filterModel.collection.products,
      gameTypes: filterModel.collection.gameTypes
    };
    const gameTypeResult = FilterHelper.calculateGameTypes(gameTypeModel);
    const baseModel: UserNameBaseQueryModel = {
      productId: filterModel.collection.products.map(product => product.productId).join(','),
      username: userName,
      site: site,
      betType: gameTypeResult.betTypes.join(','),
      leagueId: gameTypeResult.leagueIds.map(l => `${l.leagueId}-${l.betType}`).join(','),
      sportType: gameTypeResult.sportTypes.join(','),
      currency: currency,
      device: filterModel.selectedCollection.devices.map(device => device.betFrom).join(','),
      excludeTest: filterModel.isExcludeTest,
      viewByInteger: filterModel.isViewByInteger,
      totalBetType: CompareType.None,
      totalBetValue: 0,
      gameIncomeType: CompareType.None,
      gameIncomeValue: 0,
      removalColumns: filterModel.removalColumns,
      sortDirection: '',
      sortColumnName: '',
      reportBy: this.modelService.getReportBy(filterModel.reportType),
      isNormalMode: filterModel.isNormalMode,
      title: `Associated Accounts With ${userName} (${currencyName})`,
      isDrillDown: false,
      isGrandTotal: false,
      roleId: RoleId.None,
      custId: custId,
      isBaseRM: filterModel.isBaseRM,
      sportBettype: gameTypeResult.sportBetTypes.map(s => `${s.sportType}-${s.betType}`).join(','),
      isExactly: filterModel.isExactly
    };
    const model: UserNameQueryModel = Helper.extend(baseModel, this.modelService.createCriteria(filterModel));
    this.modalService.open(AssociatedAccountComponent, { size: { width: 1200 } }, model);
  }

  private showGrandTotal() {
    const gridModel = this.modeContext.gridModel;
    const queryModel = this.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);

    if(queryModel.roleId === 1) {
      queryModel.isDrillDown = false;
    }

    this.userNameService.queryGrandTotal(queryModel).subscribe(gridOptions => {
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

  private drillDownUserName(userName: string, roleId: RoleId) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.roleId = roleId;
    filterModel.userName = userName;
    const modeContext = ModeContext.create(userName, filterModel, new UserNameGridModel(false, true));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownDaily(userName: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);

    filterModel.reportType = filterModel.reportType === ReportType.SpecificMember ?
      ReportType.SpecificMemberDaily :
      ReportType.Daily;

    filterModel.userName = userName;
    const gridModel = new DailyGridModel(false, true);
    const modeContext = ModeContext.create(userName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownHourly(userName: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.Hourly;
    filterModel.userName = userName;
    const gridModel = new HourlyGridModel(false, true);
    const modeContext = ModeContext.create(userName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownByUserName(userName: string) {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel as UserNameGridModel;
    switch (filterModel.roleId) {
      case RoleId.Super:
        if (gridModel.isDrillDownFromUserName) {
          this.drillDownUserName(userName, RoleId.Master);
        } else {
          this.drillDownUserName(userName, RoleId.Super);
        }
        break;
      case RoleId.Master:
        if (gridModel.isDrillDownFromUserName) {
          this.drillDownUserName(userName, RoleId.Agent);
        } else {
          this.drillDownUserName(userName, RoleId.Master);
        }
        break;
      case RoleId.Agent:
        if (gridModel.isDrillDownFromUserName) {
          this.drillDownByMember(userName);
        } else {
          this.drillDownUserName(userName, RoleId.Agent);
        }
        break;
      case RoleId.Member:
        this.drillDownByMember(userName);
        break;
    }
  }

  private drillDownByMember(userName: string) {
    const filterModel = this.modeContext.filterModel;
    if (filterModel.isNormalMode) {
      this.drillDownHourly(userName);
    } else {
      this.drillDownDaily(userName);
    }
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: UserNameQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      if (this.gridService.hasShowHousePositionTaking()) {
        this.updateHousePositionTakingColumn(gridOptions);
      }
      if (this.gridService.hasShowAssociatedAccount()) {
        this.updateAssociatedAccountColumn(gridOptions);
      }
      if (this.hasDrillDownOnUserName()) {
        this.updateUserNameColumn(gridOptions);
      }
      if (queryModel.reportBy !== 'SpecificMember') {
        this.updateGrandTotalCell(gridOptions);
      }
    }

    gridOptions.showPager = true;
    if (_.isNil(gridOptions.pagerOption)) {
      gridOptions.pagerOption = {
        itemsPerPage: 100,
        currentPage: 0,
        itemsPerPageArray: [100, 200, 500],
        showDetail: true,
        afterPagedFunction: (pagerOption) => this.afterPaged()
      };
    } else {
      gridOptions.pagerOption.afterPagedFunction = () => this.afterPaged();
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

  private hasDrillDownOnUserName(): boolean {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel as UserNameGridModel;
    const isViewMember = filterModel.roleId === RoleId.Member
      || (filterModel.roleId === RoleId.Agent && gridModel.isDrillDownFromUserName);
    if (isViewMember && filterModel.isNormalMode) {
      return this.gridService.hasDrillDownHourly();
    }

    return true;
  }

  private afterPaged() {
    this.updateLinkAction(this.elementRef.nativeElement);
  }

  private updateHousePositionTakingColumn(gridOptions: GridOptions) {
    const housePositionTakingColumn = FilterConfig.gridColumns.housePositionTaking;
    gridOptions.bodyRows.forEach(row => {
      const customAttribute = JSON.parse(row.customAttr) as RowCustomAttribute;
      const userName = customAttribute.ReportBy;
      const custId = customAttribute.ReportById;
      for (const column of row.columns) {
        if (column.name === housePositionTakingColumn.value) {
          const housePositionTaking = column.value;
          const housePositionTakingPercent = numeral(housePositionTaking).format('0.00%');
          // tslint:disable-next-line:max-line-length
          column.value = `<a href="javascript:;" house-position-taking user-name="${userName}" cust-id="${custId}">${housePositionTakingPercent}</a>`;
        }
      }
    });
  }

  private updateAssociatedAccountColumn(gridOptions: GridOptions) {
    const associatedAccountColumn = FilterConfig.gridColumns.associatedAccount;
    gridOptions.bodyRows.forEach(row => {
      const customAttribute = JSON.parse(row.customAttr) as RowCustomAttribute;
      const userName = customAttribute.ReportBy;
      const custId = customAttribute.ReportById;
      for (const column of row.columns) {
        if (column.name === associatedAccountColumn.value) {
          // tslint:disable-next-line:max-line-length
          column.value = `<a href="javascript:;" associated-account user-name="${userName}" site="${customAttribute.SiteName}" cust-id=${custId}">Link</a>`;
        }
      }
    });
  }

  private updateUserNameColumn(gridOptions: GridOptions) {
    const reportByColumn = FilterConfig.gridColumns.reportBy;
    gridOptions.bodyRows.forEach(row => {
      for (const column of row.columns) {
        if (column.name === reportByColumn.value) {
          const customAttribute = JSON.parse(row.customAttr) as RowCustomAttribute;
          const userName = customAttribute.ReportBy;
          column.value = `<a href="javascript:;" drill-down-user-name user-name='${userName}'>${userName}</a>`;
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

  private excel(queryModel: UserNameQueryModel) {
    const isSpecificMemberReport = queryModel.reportBy === 'SpecificMember';
    const extensionFileName = isSpecificMemberReport ? 'xls' : 'xlsx';
    if (isSpecificMemberReport) {
      queryModel.removalColumns.push('AssociatedAccounts');
    }

    this.userNameService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName(extensionFileName);
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: UserNameQueryModel) {
    this.userNameService.excelGrandTotal(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: UserNameQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.userNameService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
