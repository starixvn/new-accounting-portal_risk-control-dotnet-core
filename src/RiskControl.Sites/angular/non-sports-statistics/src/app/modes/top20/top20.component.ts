import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from 'nap-components/helper';
import { ToastService } from 'nap-components/toast';
import { ModalService } from 'components/modal';
import { FilterConfig, ReportType, CompareType, GameTypeModel, FilterHelper } from '../../filter';
import { RoleId } from '../../common/model';
import { ModelService } from '../common/model.service';
import { TitleService } from '../common/title.service';
import { GridService } from '../common/grid.service';
import { RowAttribute, ModeGenerate } from '../mode.model';
import { ModeController } from '../mode-controller';
import { ModeContext } from '../mode-context';
import { UserNameQueryModel, UserNameBaseQueryModel, UserNameGridModel } from '../user-name/user-name.model';
import { UserNameService } from '../user-name/user-name.service';
import { DailyGridModel } from '../daily/daily.model';
import { HourlyGridModel } from '../hourly/hourly.model';
import { HousePositionTakingService } from '../house-position-taking/house-position-taking.service';
import { HousePositionTakingQueryModel } from '../house-position-taking/house-position-taking.model';
import { AssociatedAccountService } from '../associated-account';
import { Top20Service } from './top20.service';
import { Top20QueryModel, TopType, Top20GridModel, Top20NormalQueryModel } from './top20.model';
import { AssociatedAccountComponent } from '../associated-account/associated-account.component';

interface SubRowCustomAttribute {
  ReportBy: string;
  ReportById: number;
  SiteName: string;
}

@Component({
  selector: 'nap-top20',
  templateUrl: '../grid.html',
  providers: [
    Top20Service,
    UserNameService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class Top20Component implements OnInit, ModeGenerate {
  gridOptions: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly top20Service: Top20Service,
    private readonly userNameService: UserNameService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService,
    private readonly housePositionTakingService: HousePositionTakingService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.top20Service.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    $(grid.nativeElement).find('a[drill-down-user-name]').on('click', (event) => {
      const element = $(event.target);
      const userName = element.attr('user-name');
      this.drillDownByUserName(userName);
    });

    $(grid.nativeElement).find('a[drill-down-currency]').on('click', (event) => {
      const element = $(event.target);
      const currencyName = element.text();
      const currency = parseInt(element.attr('currency'), 10);
      const topType = parseInt(element.attr('top-type'), 10);
      this.drillDownCurrency(currencyName, currency, topType);
    });

    $(grid.nativeElement).find('a[house-position-taking]').on('click', (event) => {
      const element = $(event.target);
      const custId = parseInt(element.attr('cust-id'), 10);
      const userName = element.attr('user-name');
      this.showHousePositionTaking(custId, userName);
    });

    $(grid.nativeElement).find('a[associated-account]').on('click', (event) => {
      const element = $(event.target);
      const userName = element.attr('user-name');
      const site = element.attr('site');
      const custId = parseInt(element.attr('cust-id'), 10);
      this.showAssociatedAccounts(userName, site, custId);
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private drillDownByUserName(userName: string) {
    const filterModel = this.modeContext.filterModel;
    switch (filterModel.roleId) {
      case RoleId.Super:
        this.drillDownUserName(userName, RoleId.Super);
        break;
      case RoleId.Master:
        this.drillDownUserName(userName, RoleId.Master);
        break;
      case RoleId.Agent:
        this.drillDownUserName(userName, RoleId.Agent);
        break;
      case RoleId.Member:
        if (filterModel.isNormalMode) {
          this.drillDownHourly(userName);
        } else {
          this.drillDownDaily(userName);
        }
        break;
    }
  }

  private createQueryModel(): Top20QueryModel {
    const filterModel = this.modeContext.filterModel;
    const queryModel = this.modelService.createQueryModel() as Top20QueryModel;
    queryModel.sortColumnName = 'GameIncome';
    const gridModel = this.modeContext.gridModel;
    let topType = TopType.All;
    if (gridModel instanceof Top20GridModel) {
      topType = gridModel.topType;
    }

    queryModel.roleId = filterModel.roleId;
    queryModel.topType = topType;
    return queryModel;
  }

  private showHousePositionTaking(custId: number, userName: string) {
    const queryModel = this.createQueryModel() as Top20NormalQueryModel;
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
      reportBy: this.modelService.getReportBy(ReportType.UserName),
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

  private drillDownUserName(userName: string, roleId: RoleId) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.UserName;
    filterModel.roleId = roleId;
    filterModel.userName = userName;
    const modeContext = ModeContext.create(userName, filterModel, new Top20GridModel(false, true));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownDaily(userName: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.Daily;
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

  private drillDownCurrency(title: string, currency: number, topType: TopType) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = [currency];
    const modeContext = ModeContext.create(title, filterModel, new Top20GridModel(true, false, topType));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: Top20QueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      if (this.hasDrillDownOnUserName()) {
        this.updateUserNameColumn(gridOptions);
      }
      if (this.gridService.hasCurrencyColumn()) {
        this.updateCurrencyColumn(gridOptions);
      }
      if (this.gridService.hasShowHousePositionTaking()) {
        this.updateHousePositionTakingColumn(gridOptions);
      }
      if (this.gridService.hasShowAssociatedAccount()) {
        this.updateAssociatedAccountColumn(gridOptions);
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

  private updateHousePositionTakingColumn(gridOptions: GridOptions) {
    const housePositionTakingColumn = FilterConfig.gridColumns.housePositionTaking;
    gridOptions.bodyRows.forEach(row => {
      row.subRows.forEach(subRow => {
        const rowAttribute = JSON.parse(subRow.customAttr) as SubRowCustomAttribute;
        const userName = rowAttribute.ReportBy;
        for (const column of subRow.columns) {
          if (column.name === housePositionTakingColumn.value) {
            const custId = rowAttribute.ReportById;
            const housePositionTaking = column.value;
            const housePositionTakingPercent = numeral(housePositionTaking).format('0.00%');
            // tslint:disable-next-line:max-line-length
            column.value = `<a href="javascript:;" house-position-taking user-name="${userName}" cust-id="${custId}">${housePositionTakingPercent}</a>`;
            break;
          }
        }
      });
    });
  }

  private updateAssociatedAccountColumn(gridOptions: GridOptions) {
    const associatedAccountColumn = FilterConfig.gridColumns.associatedAccount;
    gridOptions.bodyRows.forEach(row => {
      row.subRows.forEach(subRow => {
        const rowAttribute = JSON.parse(subRow.customAttr) as SubRowCustomAttribute;
        const userName = rowAttribute.ReportBy;
        const custId = rowAttribute.ReportById;
        for (const column of subRow.columns) {
          if (column.name === associatedAccountColumn.value) {
            // tslint:disable-next-line:max-line-length
            column.value = `<a href="javascript:;" associated-account user-name="${userName}" site="${rowAttribute.SiteName}" cust-id="${custId}">Link</a>`;
            break;
          }
        }
      });
    });
  }

  private updateUserNameColumn(gridOptions: GridOptions) {
    const reportByColumn = FilterConfig.gridColumns.reportBy;
    gridOptions.bodyRows.forEach(row => {
      row.subRows.forEach(subRow => {
        for (const column of subRow.columns) {
          if (column.name === reportByColumn.value) {
            const rowAttribute = JSON.parse(subRow.customAttr) as SubRowCustomAttribute;
            const userName = rowAttribute.ReportBy;
            column.value = `<a href="javascript:;" drill-down-user-name user-name="${userName}">${userName}</a>`;
            break;
          }
        }
      });
    });
  }

  private updateCurrencyColumn(gridOptions: GridOptions) {
    const currencyColumn = FilterConfig.gridColumns.currency;
    gridOptions.bodyRows.forEach(row => {
      const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
      const topType = rowAttribute.groupId;
      for (const column of row.columns) {
        if (column.name === currencyColumn.value) {
          const currency = column.customAttr;
          // tslint:disable-next-line:max-line-length
          column.value = `<a href="javascript:;" drill-down-currency currency="${currency}" top-type="${topType}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private excel(queryModel: Top20QueryModel) {
    const filterModel = this.modeContext.filterModel;
    const maxDate = moment.utc(filterModel.startDate).add(1, 'month');
    if (filterModel.roleId === RoleId.Member && !filterModel.endDate.isBefore(maxDate)) {
      this.toastService.activate(`Date range should not exceed 1 month to export excel!`);
      return;
    }

    if (queryModel.topType === TopType.All) {
      const userNameQueryModel: UserNameQueryModel = _.cloneDeep(queryModel);
      userNameQueryModel.reportBy = this.modelService.getReportBy(ReportType.UserName);
      this.userNameService.excel(userNameQueryModel)
        .subscribe(response => {
          const fileName = this.titleService.getExcelFileName('xlsx');
          Helper.downloadFile(response, fileName);
        });
    } else {
      this.top20Service.excel(queryModel)
        .subscribe(response => {
          const fileName = this.titleService.getExcelFileName();
          Helper.downloadFile(response, fileName);
        });
    }
  }

  private sort(queryModel: Top20QueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.top20Service.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
