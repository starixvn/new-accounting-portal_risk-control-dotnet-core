import { TreeViewBuilderService } from './treeview-builder.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastService } from 'nap-components/toast';
import { DropdownTreeviewComponent, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { NapDateStruct, DateHelper } from 'nap-components/date';
import { ProductId, RoleId, DATE_CONFIG, GameTypeId } from '../common';
import { FilterConfig } from './filter.config';
import { FilterService } from './filter.service';
import { ColumnService } from './column.service';
import {
  Product, GameType, Device, Currency, CompareType, FilterMode, TimePeriod,
  FilterModel, ReportType, GameTypeModel, NumberGameGameType, TimeRange, SiteGroupModel, SportGameType, Column,
  SavedFilterQueryModel,
  SavedFilterContentModel
} from './filter.model';
import { FilterHelper } from './filter-helper';
import { UserNameSuggestionTextboxComponent } from './user-name-suggestion/user-name-suggestion-textbox.component';
import { ModalService } from 'components/modal';
import { SaveFilterComponent } from './save-filter/save-filter.component';
import { SavedFilterGridComponent } from 'components/saved-filter-grid/saved-filter-grid.component';
import { SavedFilterService } from './save-filter/saved-filter.service';
import { ActionConstants, LocalStorageKey, ReportConstants } from 'app/common/constants';
import { DataService } from 'app/common/data.service';

class CurrencyHelper {
  private readonly currenciesWithoutAll: Currency[];
  private readonly baseRMCurrency: Currency;
  private readonly currenciesWithoutAllAndBaseRM: Currency[];

  constructor(
    private readonly currencies: Currency[]
  ) {
    this.currenciesWithoutAll = this.currencies.filter(currency => currency.exchangeId !== FilterConfig.currencyAllValue);
    this.baseRMCurrency = this.currencies.filter(currency => currency.exchangeId === FilterConfig.currencyBaseRM)[0];
    this.currenciesWithoutAllAndBaseRM = this.currencies.filter(currency => currency.exchangeId !== FilterConfig.currencyAllValue
      && currency.exchangeId !== FilterConfig.currencyBaseRM);
  }

  getAllOfCurrencies(): Currency[] {
    return this.currencies;
  }

  getAllOfCurrenciesWithoutAllItem(): Currency[] {
    return this.currenciesWithoutAll;
  }

  getBaseRMCurrency(): Currency {
    return this.baseRMCurrency;
  }

  getCurrenciesWithoutAllAndBaseRM(): Currency[] {
    return this.currenciesWithoutAllAndBaseRM;
  }
}

@Component({
  selector: 'nap-filter',
  templateUrl: './filter.component.html',
  styleUrls: [
    './filter.component.scss'
  ],
  providers: [
    ColumnService,
    TreeViewBuilderService
  ]
})
export class FilterComponent implements OnInit {
  @ViewChild('userNameSuggestion') userNameSuggestion: UserNameSuggestionTextboxComponent;
  @ViewChild('siteDropdownTreeview') siteDropdownTreeview: DropdownTreeviewComponent;
  @ViewChild('productDropdownTreeview') productDropdownTreeview: DropdownTreeviewComponent;
  @ViewChild('columnDropdownTreeview') columnDropdownTreeview: DropdownTreeviewComponent;
  @Output() generate = new EventEmitter<FilterModel>();
  @Output() reset = new EventEmitter();
  today = DATE_CONFIG.reportDate.today;
  yesterday = DATE_CONFIG.reportDate.yesterday;
  mode: FilterMode = FilterMode.Normal;
  isExcludeTest = true;
  isViewByInteger = false;
  isBaseRM = true;
  productTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: true,
    maxHeight: 500
  });
  products: Product[] = [];
  selectedProducts: Product[] = [];
  productTreeViewItems: TreeviewItem[] = [];
  gameTypeTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: true,
    maxHeight: 500
  });
  gameTypes: GameType[] = [];
  selectedGameTypes: GameType[] = [];
  gameTypeTreeViewItems: TreeviewItem[] = [];
  deviceTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: true,
    maxHeight: 500
  });
  devices: Device[] = [];
  selectedDevices: Device[] = [];
  deviceTreeViewItems: TreeviewItem[] = [];
  siteTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  sites: SiteGroupModel[] = [];
  selectedSites: SiteGroupModel[] = [];
  defaultSelectedSite: SiteGroupModel[] = [];
  siteTreeViewItems: TreeviewItem[] = [];
  columns: Column[] = [];
  selectedColumns: Column[] = [];
  columnTreeViewItems: TreeviewItem[] = [];
  currenciesTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  currencies: Currency[] = [];
  selectedCurrencies: Currency[];
  currenciesTreeViewItems: TreeviewItem[] = [];
  reportTypeSelectItems = this.filterService.getReportSelectItems().filter(x => x.visible);
  selectedReportType: ReportType = ReportType.Daily;
  compareTypeSelectItems = this.filterService.getCompareTypeSelectItems();
  totalBetsCompareType: CompareType = CompareType.None;
  totalBetsValue: number;
  gameIncomeCompareType: CompareType = CompareType.None;
  gameIncomeValue: number;
  housePTCompareType: CompareType = CompareType.None;
  housePTSelectItems = this.filterService.getHousePTSelectItems();
  housePTValue: number;
  date: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  minStartDate: NapDateStruct = { year: 2013, month: 1, day: 1 };
  maxEndDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  startDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.yesterday);
  endDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.yesterday);
  minDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.moveBetDate.add('1', 'day'));
  maxDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  username = '';
  timePeriodSelectItems = this.filterService.getTimePeriodSelectItems();
  timePeriod: TimePeriod = TimePeriod.Yesterday;
  isYerterdayDataWarehouseReady = true;
  top20RoleSelectItems = FilterHelper.getRoleSelectItems();
  roleId = RoleId.Member;
  reportRoleId = this.getReportRoleId();
  hasNormalMode = false;
  hasHistoryMode = false;
  exactMatching = true;
  sortColumnName = '';
  sortDirection = '';
  cachedReportType = ReportType.Product;
  private currencyHelper: CurrencyHelper;
  private isGenerate: boolean;
  private readonly valueRequired = 'Value is required!';
  private readonly lastWeekStartDate = moment.utc(DATE_CONFIG.reportDate.today).startOf('isoWeek').subtract(1, 'week');
  private readonly lastMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(1, 'month').startOf('month');
  private readonly lastThreeMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(3, 'month').startOf('month');
  private readonly lastSixMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(6, 'month').startOf('month');
  private readonly lastYearStartDate = moment.utc(DATE_CONFIG.reportDate.today).add(1, "day").subtract(1, 'year');
  private numberLicensees = 0;

  private readonly TimeRanges: TimeRange[] = [
    {
      timePeriodType: TimePeriod.Today,
      startDate: moment.utc(DATE_CONFIG.reportDate.today),
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    },
    {
      timePeriodType: TimePeriod.Yesterday,
      startDate: moment.utc(DATE_CONFIG.reportDate.yesterday),
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
    },
    {
      timePeriodType: TimePeriod.CurrentWeek,
      startDate: moment.utc(DATE_CONFIG.reportDate.today).startOf('week'),
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    },
    {
      timePeriodType: TimePeriod.LastWeek,
      startDate: moment.utc(DATE_CONFIG.reportDate.today).startOf('isoWeek').subtract(1, 'week'),
      endDate: moment.utc(this.lastWeekStartDate).endOf('isoWeek')
    },
    {
      timePeriodType: TimePeriod.CurrentMonth,
      startDate: moment.utc(DATE_CONFIG.reportDate.today).startOf('month'),
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    },
    {
      timePeriodType: TimePeriod.LastMonth,
      startDate: this.lastMonthStartDate,
      endDate: moment.utc(this.lastMonthStartDate).endOf('month')
    },
    {
      timePeriodType: TimePeriod.SinceLastMonth,
      startDate: this.lastMonthStartDate,
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    },
    {
      timePeriodType: TimePeriod.LastThreeMonths,
      startDate: this.lastThreeMonthStartDate,
      endDate: moment.utc(this.lastMonthStartDate).endOf('month')
    },
    {
      timePeriodType: TimePeriod.LastSixMonths,
      startDate: this.lastSixMonthStartDate,
      endDate: moment.utc(this.lastMonthStartDate).endOf('month')
    },
    {
      timePeriodType: TimePeriod.SinceLastYear,
      startDate: this.lastYearStartDate,
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    }
  ];


  constructor(
    private readonly filterService: FilterService,
    private readonly columnService: ColumnService,
    private readonly toastService: ToastService,
    private readonly treeviewBuilderService: TreeViewBuilderService,
    private readonly modalService: ModalService,
    private readonly savedFilterService: SavedFilterService,
    private readonly dataService: DataService
  ) { }

  ngOnInit() {
    this.initFilter();
    this.dataService.selectedFilterData$.subscribe(filter => {
      if (filter.length > 0) {
        this.reloadFilter(filter);
      }
    })
  }

  get isNormalMode(): boolean {
    return this.mode === FilterMode.Normal;
  }

  get isSelectedTop20Report(): boolean {
    return this.selectedReportType === ReportType.Top20;
  }

  onProductChange(event: Product[]) {
    const isEqualProducts = _.isEqual(event, this.selectedProducts);

    if (!isEqualProducts) {
      this.selectedProducts = event;

      if (event != null && event.length > 0) {
        localStorage.setItem(LocalStorageKey.PRODUCTS, JSON.stringify(event));
      }
    }

    const productIds = this.selectedProducts.map(product => product.productId).join(',');
    this.getSites(isEqualProducts, productIds);
    this.getGameTypes(isEqualProducts);
  }

  onSiteChange(event: SiteGroupModel[]) {
    const cachedSites = JSON.parse(localStorage.getItem(LocalStorageKey.SITES)) as SiteGroupModel[];
    const isEqualSites = _.isEqual(event, cachedSites);

    if (!isEqualSites) {
      if (event != null && event.length > 0) {
        localStorage.setItem(LocalStorageKey.SITES, JSON.stringify(event));
      }
    }

    this.selectedSites = event;

    if (this.selectedSites.length === 0) {
      this.currencies = [];
    } else {
      const siteIds = _.uniq(this.selectedSites.map(site => site.licenseeId));
      const siteIdsValue = this.numberLicensees === this.selectedSites.filter(x => x.licenseeId !== 0).length
        ? 'All'
        : siteIds.join(',');
      this.filterService.getCurrencies(siteIdsValue).subscribe(currencies => {
        this.currencyHelper = new CurrencyHelper(currencies);
        const currenciesWithoutAllAndBaseRM = this.currencyHelper.getCurrenciesWithoutAllAndBaseRM();
        const currenciesData = currenciesWithoutAllAndBaseRM.filter(x => !x.isTest || x.isTest === !this.isExcludeTest);
        this.selectedCurrencies = isEqualSites ?
          JSON.parse(localStorage.getItem(LocalStorageKey.CURRENCIES)) as Currency[] :
          currenciesData;

        if (this.selectedCurrencies == null || this.selectedCurrencies.length === 0) {
          this.selectedCurrencies = currenciesWithoutAllAndBaseRM;
        }

        this.currenciesTreeViewItems = this.treeviewBuilderService.buildCurrencyTreeViewItems(currenciesData, this.selectedCurrencies);
        this.currencies = currenciesWithoutAllAndBaseRM;
      });
    }
  }

  onTotalBetsTypeChange() {
    if (this.totalBetsCompareType === CompareType.None) {
      this.totalBetsValue = undefined;
      localStorage.setItem(LocalStorageKey.TOTAL_BET_VALUE, JSON.stringify(null));
    }

    localStorage.setItem(LocalStorageKey.TOTAL_BET_COMPARE_TYPE, JSON.stringify(this.totalBetsCompareType));
  }

  onGameIncomeTypeChange() {
    if (this.gameIncomeCompareType === CompareType.None) {
      this.gameIncomeValue = undefined;
      localStorage.setItem(LocalStorageKey.GAME_INCOME_VALUE, JSON.stringify(null));
    }

    localStorage.setItem(LocalStorageKey.GAME_INCOME_COMPARE_TYPE, JSON.stringify(this.gameIncomeCompareType));
  }

  onHousePTTypeChange() {
    if (this.housePTCompareType === CompareType.None) {
      this.housePTValue = undefined;
      localStorage.setItem(LocalStorageKey.HOUSEPT_VALUE, JSON.stringify(-1));
    }

    localStorage.setItem(LocalStorageKey.HOUSEPT_COMPARE_TYPE, JSON.stringify(this.housePTCompareType));
  }

  onHousePTChange($event: number) {
    this.housePTValue = $event;
    localStorage.setItem(LocalStorageKey.HOUSEPT_VALUE, JSON.stringify($event));
  }

  onReportTypeChange(newReportType: ReportType) {
    let cachedReportType = JSON.parse(localStorage.getItem(LocalStorageKey.REPORT_TYPE)) as ReportType;
    const reportTypeChange = newReportType !== cachedReportType;
    const lastReportRoleId = this.reportRoleId;
    this.selectedReportType = newReportType;
    this.getColumns(reportTypeChange);
    if (this.selectedReportType === ReportType.Monthly && this.mode === FilterMode.Normal) {
      this.mode = FilterMode.History;
      localStorage.setItem(LocalStorageKey.MODE, JSON.stringify(this.mode));
      this.timePeriod = TimePeriod.LastMonth;
      this.onTimePeriodChange();
    }

    this.reportRoleId = this.getReportRoleId();
    if (this.reportRoleId !== lastReportRoleId) {
      this.userNameSuggestion.reset();
    }

    localStorage.setItem(LocalStorageKey.REPORT_TYPE, JSON.stringify(newReportType));
  }

  onTop20RoleIdChange(roleId: RoleId) {
    let cachedRoleId = JSON.parse(localStorage.getItem(LocalStorageKey.ROLEID)) as RoleId;
    if (roleId !== cachedRoleId) {
      localStorage.setItem(LocalStorageKey.ROLEID, JSON.stringify(roleId));
    }

    this.roleId = roleId;
    this.reportRoleId = this.getReportRoleId();
    this.userNameSuggestion.reset();
  }

  onGameTypeChange(selectedGameTypes: GameType[]) {
    if (selectedGameTypes != null && selectedGameTypes.length > 0) {
      localStorage.setItem(LocalStorageKey.GAME_TYPES, JSON.stringify(selectedGameTypes));
    }

    this.selectedGameTypes = selectedGameTypes;
  }

  onDeviceChange($event: Device[]) {
    if ($event != null && $event.length > 0) {
      localStorage.setItem(LocalStorageKey.DEVICES, JSON.stringify($event));
    }

    this.selectedDevices = $event;
  }

  onCurrenciesChange($event: Currency[]) {
    if ($event != null && $event.length > 0) {
      localStorage.setItem(LocalStorageKey.CURRENCIES, JSON.stringify($event));
    }

    this.selectedCurrencies = $event;
  }

  onColumnChange($event: Column[]) {
    if ($event != null && $event.length > 0) {
      localStorage.setItem(LocalStorageKey.COLUMNS, JSON.stringify($event));
    }

    this.selectedColumns = $event;
  }

  gameIncomeChange($event: number) {
    this.gameIncomeValue = $event;
    localStorage.setItem(LocalStorageKey.GAME_INCOME_VALUE, JSON.stringify($event));
  }

  totalBetChange($event: number) {
    this.totalBetsValue = $event;
    localStorage.setItem(LocalStorageKey.TOTAL_BET_VALUE, JSON.stringify($event));
  }

  excludeTestChangeEvent($event: boolean) {
    this.isExcludeTest = $event;
    localStorage.setItem(LocalStorageKey.IS_EXCLUDE_TEST, JSON.stringify($event));

    const gameTypes = this.gameTypes.filter(x => !x.isTest || x.isTest === !$event);
    this.gameTypeTreeViewItems = this.treeviewBuilderService.buildGameTypeTreeViewItems(gameTypes, this.selectedProducts, gameTypes);

    const currencies = this.currencies.filter(x => !x.isTest || x.isTest === !$event);
    const copyObjects = currencies.map(object => _.cloneDeep(object));
    this.currenciesTreeViewItems = this.treeviewBuilderService.buildCurrencyTreeViewItems(copyObjects, copyObjects);
  }

  viewByIntegerChange($event: boolean) {
    this.isViewByInteger = $event;
    localStorage.setItem(LocalStorageKey.IS_VIEW_BY_INTEGER, JSON.stringify($event));
  }

  checkExactMatchingValue($event: boolean) {
    this.exactMatching = $event;
    localStorage.setItem(LocalStorageKey.EXACT_MATCHING, JSON.stringify($event));
  }

  onGenerateClick() {
    if (this.userNameSuggestion.isOpen) {
      this.isGenerate = true;
    } else {
      this.generateInternal();
    }
  }

  onUserNameSuggestionComplete(userNames: string[]) {
    if (userNames.length > 0) {
      const combinatedUserName = userNames.join(',');

        this.username = combinatedUserName;
        if (this.isGenerate) {
          this.isGenerate = false;
          this.generateInternal();
        }
    } else {
      this.username = '';
      if (this.isGenerate) {
        this.isGenerate = false;
        this.generateInternal();
      }
    }
  }

  onDateClick(date: moment.Moment) {
    this.date = DateHelper.convertMomentToDateStruct(date);
    this.generateInternal();
  }

  toggleMode() {
    if (this.mode === FilterMode.Normal) {
      this.mode = FilterMode.History;
      this.filterService.checkYesterdayDataWarehouseIsReady().subscribe(isReady => this.isYerterdayDataWarehouseReady = isReady);
    } else {
      this.mode = FilterMode.Normal;
      this.housePTCompareType = CompareType.None;
      this.housePTValue = this.housePTSelectItems[0].value;
      if (this.selectedReportType === ReportType.Monthly) {
        this.date = DateHelper.convertMomentToDateStruct(this.today);
        if (this.products.length === this.selectedProducts.length) {
          this.selectedReportType = ReportType.Product;
        } else {
          this.selectedReportType = ReportType.Daily;
        }
      }
    }

    localStorage.setItem(LocalStorageKey.MODE, JSON.stringify(this.mode));
    this.getColumns(false);
    this.reset.emit();
  }

  onTimePeriodChange() {
    const timePeriod = this.timePeriod;
    const timmePeriodData = _.find(this.TimeRanges, function (period) {
      return period.timePeriodType === timePeriod;
    });

    if (!_.isNil(timmePeriodData.startDate) && !_.isNil(timmePeriodData.endDate)) {
      this.startDate = DateHelper.convertMomentToDateStruct(timmePeriodData.startDate);
      this.endDate = DateHelper.convertMomentToDateStruct(timmePeriodData.endDate);
    }
  }

  onDateChange() {
    this.timePeriod = TimePeriod.SpecificDate;
  }

  onResetClick() {
    localStorage.clear();
    this.userNameSuggestion.reset();
    this.initFilter();
  }

  onSaveFilterClick() {
    const content = this.createContentForSavedFilter();
    this.modalService.open(SaveFilterComponent, { size: { width: 340 } }, content);
  }

  showSavedFilters() {
    const queryModel: SavedFilterQueryModel = {
      reportId: ReportConstants.NON_SPORT,
      reportName: ReportConstants.NON_SPORT_TEXT,
      action: ActionConstants.SELECT
    }
    this.savedFilterService.queryFilters(queryModel, false).subscribe(data => {
      const modalRef = this.modalService.open(SavedFilterGridComponent, { size: { width: 500 } }, data);
      modalRef.contentViewRef
    })
  }

  checkBaseRMValue(isCheck: boolean) {
    this.isBaseRM = isCheck;
    localStorage.setItem(LocalStorageKey.IS_BASERM_CHECK, JSON.stringify(isCheck));
  }
  private generateInternal() {
    this.reset.emit();
    if (!this.isValid) {
      return;
    }

    const model = this.createModel();
    if (model.sportBettypes.filter(s => s.sportType === undefined).length > 0
      || model.leagueIds.filter(l => l.leagueId === undefined).length > 0)
    {
      this.filterService.writeLog(this.gameTypes, this.selectedProducts, this.selectedGameTypes).subscribe();
    }

    this.generate.emit(model);
  }

  private get isValidProduct(): boolean {
    if (this.selectedProducts.length === 0) {
      this.toastService.activate(`Please select at least one product!`);
      return false;
    }

    return true;
  }

  private get isValidSite(): boolean {
    if (this.selectedSites.length === 0) {
      this.toastService.activate(`Please select at least one company!`);
      return false;
    }

    return true;
  }

  private get isValidGameType(): boolean {
    if (this.selectedGameTypes.length === 0) {
      this.toastService.activate(`Please select at least one game type!`);
      return false;
    }

    return true;
  }

  private get isValidTotalBet(): boolean {
    if (this.totalBetsCompareType !== CompareType.None && (!this.totalBetsValue || this.totalBetsValue === 0)) {
      this.toastService.activate(`Total Bets: ${this.valueRequired}`);
      return false;
    }

    return true;
  }

  private get isValidDevice(): boolean {
    if (this.selectedDevices.length === 0) {
      this.toastService.activate(`Please select at least one device!`);
      return false;
    }

    return true;
  }

  private get isValidGameIncome(): boolean {
    if (this.gameIncomeCompareType !== CompareType.None && (!this.gameIncomeValue || this.gameIncomeValue === 0)) {
      this.toastService.activate(`Game Income: ${this.valueRequired}`);
      return false;
    }

    return true;
  }

  private get isValidHousePT(): boolean {
    if (this.isNormalMode
      && this.housePTCompareType !== CompareType.None
      && (_.isNil(this.housePTValue) || this.housePTValue === FilterConfig.housePTAllValue)) {
      this.toastService.activate(`House PT %: ${this.valueRequired}`);
      return false;
    }

    return true;
  }

  private get isValidCurrency(): boolean {
    if (this.selectedCurrencies.length === 0) {
      this.toastService.activate(`Please select at least one currency!`);
      return false;
    }

    return true;
  }

  private get isValidDateRange(): boolean {
    if (!this.isNormalMode) {
      const maxDate = DateHelper.convertDateStructToMoment(this.startDate).add(12, 'month');
      if (!DateHelper.convertDateStructToMoment(this.endDate).isBefore(maxDate)) {
        this.toastService.activate(`Date range should not exceed 12 months!`);
        return false;
      }
    }

    return true;
  }

  private get isValid(): boolean {
    return this.isValidDateRange &&
      this.isValidProduct &&
      this.isValidSite &&
      this.isValidGameType &&
      this.isValidTotalBet &&
      this.isValidDevice &&
      this.isValidGameIncome &&
      this.isValidHousePT &&
      this.isValidCurrency;
  }

  private createModel(): FilterModel {
    const gameTypeModel: GameTypeModel = {
      products: this.selectedProducts,
      gameTypes: this.selectedGameTypes
    };
    const gameTypeResult = FilterHelper.calculateGameTypes(gameTypeModel);
    let reportType = this.selectedReportType;
    if (reportType === ReportType.Top20 && this.username !== '') {
      reportType = ReportType.UserName;
    }
    const sort = localStorage.getItem(LocalStorageKey.SORT);
    if (!_.isNil(sort) && sort !== 'null') {
      const detailedSort = sort.split('**');
      const reportBy = JSON.parse(detailedSort[2]) as ReportType
      this.sortColumnName = reportBy !== ReportType.Top20 ? detailedSort[0] : '';
      this.sortDirection = reportBy !== ReportType.Top20 ? detailedSort[1] : '';
      this.cachedReportType = reportBy;
    } else {
      this.sortColumnName = '';
      this.sortDirection = '';
      this.cachedReportType = ReportType.Daily;
    }
    const model: FilterModel = {
      reportType: reportType,
      roleId: this.roleId,
      productIds: gameTypeResult.productIds,
      userName: this.username,
      sites: this.numberLicensees === this.selectedSites.filter(x => x.licenseeId !== 0).length
        ? ['All']
        : this.selectedSites.map(site => site.licenseeName),
      betTypes: gameTypeResult.betTypes,
      leagueIds: gameTypeResult.leagueIds,
      sportTypes: gameTypeResult.sportTypes,
      currency: this.isBaseRM ?
        [-1]
        : this.selectedCurrencies.map(currency => currency.exchangeId),
      devices: this.selectedDevices.map(device => device.betFrom),
      isExcludeTest: this.isExcludeTest,
      isViewByInteger: this.isViewByInteger,
      totalBetType: this.totalBetsCompareType,
      totalBetValue: this.totalBetsValue === null ? 0 : this.totalBetsValue,
      gameIncomeType: this.gameIncomeCompareType,
      gameIncomeValue: this.gameIncomeValue === null ? 0 : this.gameIncomeValue,
      housePTType: this.housePTCompareType,
      housePTValue: this.housePTValue,
      removalColumns: this.columnDropdownTreeview.items
        .filter(item => item.checked === false)
        .map(item => item.value.value),
      isNormalMode: this.isNormalMode,
      startDate: DateHelper.convertDateStructToMoment(this.isNormalMode ? this.date : this.startDate),
      endDate: DateHelper.convertDateStructToMoment(this.isNormalMode ? this.date : this.endDate),
      collection: {
        products: this.products,
        gameTypes: this.transformGameTypes(this.gameTypes),
        devices: this.devices,
        currencies: this.currencies
      },
      selectedCollection: {
        products: this.selectedProducts,
        gameTypes: this.selectedGameTypes,
        devices: this.selectedDevices,
        currencies: this.currencies
      },
      isBaseRM: this.isBaseRM,
      sportBettypes: gameTypeResult.sportBetTypes,
      isExactly: this.exactMatching,
      sortColumnName: this.selectedReportType === this.cachedReportType ? this.sortColumnName : '',
      sortDirection: this.selectedReportType === this.cachedReportType ? this.sortDirection : ''
    };
    return model;
  }

  private getReportRoleId(): RoleId {
    let roleId = JSON.parse(localStorage.getItem(LocalStorageKey.ROLEID)) as RoleId;
    if (roleId === null) {
      roleId = RoleId.Member;
    }

    return roleId;
  }

  private transformGameTypes(gameTypes: GameType[]): GameType[] {
    let result: GameType[] = [];
    const productIds = _.uniq(gameTypes.map(gameType => gameType.productId));
    productIds.forEach(productId => {
      let productGameTypes = gameTypes.filter(gameType => gameType.productId === productId);
      if (productId === ProductId.NumberGame) {
        const leagueGameTypes = productGameTypes.filter(gameType => gameType.gameType === GameTypeId.League);
        const numberGameBetTypes = productGameTypes.filter(gameType => gameType.gameType === GameTypeId.BetType);

        let numberGameGameTypes: GameType[] = [];
        leagueGameTypes.forEach(gameType => {
          const numberGameLeagueGameTypes = numberGameBetTypes.map(betType => {
            const numberGameLeagueGameType: NumberGameGameType = _.extend({}, { leagueId: gameType.typeId }, betType);
            return numberGameLeagueGameType;
          });
          numberGameGameTypes = numberGameGameTypes.concat(numberGameLeagueGameTypes);
        });

        productGameTypes = numberGameGameTypes;
      }

      if (productId === ProductId.SabaClub) {
        const sportGameTypes = productGameTypes.filter(gameType => gameType.gameType === GameTypeId.SportType);
        let sabaClubGameTypes: GameType[] = [];
        sportGameTypes.forEach(sportType => {
          const sabaClubBetTypes = productGameTypes.filter(gameType => gameType.gameType === sportType.typeId);
          const sabaClubSportBetTypes = sabaClubBetTypes.map(betType => {
            const sabaClubSportBetType: SportGameType = _.extend({}, { sportType: sportType.typeId }, betType);
            return sabaClubSportBetType;
          });
          sabaClubGameTypes = sabaClubGameTypes.concat(sabaClubSportBetTypes);
        });

        productGameTypes = sabaClubGameTypes;
      }

      if (productId === ProductId.VGaming) {
        const sportGameTypes = productGameTypes.filter(gameType => gameType.gameType === GameTypeId.SportType);
        let vGamingGameTypes: GameType[] = [];
        sportGameTypes.forEach(sportType => {
          const vGamingBetTypes = productGameTypes.filter(gameType => gameType.gameType === sportType.typeId);
          const vGamingSportBetTypes = vGamingBetTypes.map(betType => {
            const vGamingSportBetType: SportGameType = _.extend({}, { sportType: sportType.typeId }, betType);
            return vGamingSportBetType;
          });
          vGamingGameTypes = vGamingGameTypes.concat(vGamingSportBetTypes);
        });

        productGameTypes = vGamingGameTypes;
      }

      result = result.concat(productGameTypes);
    });

    return result;
  }

  private countingNumberLicensees(siteGroups: SiteGroupModel[]) {
    siteGroups.forEach(siteGroup => {
      if (siteGroup.licenseeId !== 0) {
        this.numberLicensees++;
      }

      if (siteGroup.childGroups != null && siteGroup.childGroups.length > 0) {
        this.countingNumberLicensees(siteGroup.childGroups);
      }
    });
  }

  private getSites(isEqualProducts: boolean, productIds: string) {
    if (productIds === '') {
      this.sites = [];
    } else {
      this.filterService.getSites(productIds).subscribe(sites => {
        this.numberLicensees = 0;
        this.countingNumberLicensees(sites);
        this.sites = sites;
        this.getDefaultSelectedSites(sites);

        this.selectedSites = isEqualProducts ?
          JSON.parse(localStorage.getItem(LocalStorageKey.SITES)) as SiteGroupModel[] :
          this.defaultSelectedSite;

        if (this.selectedSites == null || this.numberLicensees === 0) {
          this.selectedSites = this.defaultSelectedSite;
        }

        this.siteTreeViewItems = this.treeviewBuilderService.buildSiteTreeViewItems(sites, this.selectedSites);
      });
    }
  }

  private getDefaultSelectedSites(siteGroups: SiteGroupModel[]) {
    siteGroups.forEach(siteGroup => {
      if (siteGroup.childGroups == null || siteGroup.childGroups.length === 0) {
        this.defaultSelectedSite.push({
          groupId: siteGroup.groupId,
          groupName: siteGroup.groupName,
          parentId: siteGroup.parentId,
          licenseeId: siteGroup.licenseeId,
          licenseeName: siteGroup.licenseeName
        } as SiteGroupModel);
      }

      if (siteGroup.childGroups != null && siteGroup.childGroups.length > 0) {
        this.getDefaultSelectedSites(siteGroup.childGroups);
      }
    });
  }

  private getColumns(reportTypeChange: boolean) {
    const columns = this.columnService.getColumns(this.selectedReportType, this.isNormalMode);
    this.columns = columns;
    this.selectedColumns = reportTypeChange ?
      null :
      JSON.parse(localStorage.getItem(LocalStorageKey.COLUMNS)) as Column[];
    this.columnTreeViewItems = this.columnService.buildColumnTreeViewItems(this.columns, this.selectedColumns);
  }

  private getGameTypes(isEqualProducts: boolean) {
    const uncheckedGameTypes: string[] = ['Jackpot Prize', 'Promotion', 'Tournament Prize', 'Promotion Prize'];
    this.filterService.getGameTypes().subscribe(gameTypes => {
      this.gameTypes = gameTypes;
      const defaultGameTypes = gameTypes.filter(x => !uncheckedGameTypes.includes(x.typeName));

      this.selectedGameTypes = isEqualProducts ?
        JSON.parse(localStorage.getItem(LocalStorageKey.GAME_TYPES)) as GameType[] :
        defaultGameTypes;

      if (this.selectedGameTypes == null || this.selectedGameTypes.length === 0) {
        this.selectedGameTypes = defaultGameTypes;
      }

      this.gameTypeTreeViewItems = this.treeviewBuilderService.buildGameTypeTreeViewItems(gameTypes, this.selectedProducts, this.selectedGameTypes);
    }
    );
  }

  private initFilter() {
    const isBaseRM = JSON.parse(localStorage.getItem(LocalStorageKey.IS_BASERM_CHECK)) as boolean;
    this.isBaseRM = isBaseRM === null ? true : isBaseRM;

    let reportType = JSON.parse(localStorage.getItem(LocalStorageKey.REPORT_TYPE)) as ReportType;

    if (reportType === null) {
      reportType = ReportType.Daily;
    }

    let roleId = JSON.parse(localStorage.getItem(LocalStorageKey.ROLEID)) as RoleId;

    this.roleId = roleId === null ? RoleId.Member : roleId;

    this.onReportTypeChange(reportType);

    const isExcludeTest = JSON.parse(localStorage.getItem(LocalStorageKey.IS_EXCLUDE_TEST)) as boolean;

    if (isExcludeTest !== null) {
      this.isExcludeTest = isExcludeTest;
    } else {
      this.isExcludeTest = true;
    }

    const viewByInteger = JSON.parse(localStorage.getItem(LocalStorageKey.IS_VIEW_BY_INTEGER)) as boolean;

    if (viewByInteger !== null) {
      this.isViewByInteger = viewByInteger;
    } else {
      this.isViewByInteger = false;
    }

    const exactMatching = JSON.parse(localStorage.getItem(LocalStorageKey.EXACT_MATCHING)) as boolean;

    if (exactMatching !== null) {
      this.exactMatching = exactMatching;
    } else {
      this.exactMatching = true;
    }


    this.totalBetsCompareType = JSON.parse(localStorage.getItem(LocalStorageKey.TOTAL_BET_COMPARE_TYPE)) as CompareType;

    if (this.totalBetsCompareType === null) {
      this.totalBetsCompareType = CompareType.None;
    }

    const totalBetsValue = JSON.parse(localStorage.getItem(LocalStorageKey.TOTAL_BET_VALUE)) as number;

    this.totalBetsValue = totalBetsValue === null ? undefined : totalBetsValue;

    this.gameIncomeCompareType = JSON.parse(localStorage.getItem(LocalStorageKey.GAME_INCOME_COMPARE_TYPE)) as CompareType;

    if (this.gameIncomeCompareType === null) {
      this.gameIncomeCompareType = CompareType.None;
    }

    const gameIncomeValue = JSON.parse(localStorage.getItem(LocalStorageKey.GAME_INCOME_VALUE)) as number;

    this.gameIncomeValue = gameIncomeValue === null ? undefined : gameIncomeValue;

    this.housePTCompareType = JSON.parse(localStorage.getItem(LocalStorageKey.HOUSEPT_COMPARE_TYPE)) as CompareType;
    if (this.housePTCompareType === null) {
      this.housePTCompareType = CompareType.None;
    }

    const housePTValue = JSON.parse(localStorage.getItem(LocalStorageKey.HOUSEPT_VALUE)) as number;

    this.housePTValue = housePTValue === null ? undefined : housePTValue;

    forkJoin([this.filterService.getPermission(), this.filterService.getProducts()]).subscribe(data => {
      this.mode = JSON.parse(localStorage.getItem(LocalStorageKey.MODE)) as FilterMode;

      if (this.mode === null) {
        this.mode = FilterMode.Normal;
      }

      const permission = data[0];
      this.hasNormalMode = permission.modes.indexOf('Normal Mode') !== -1;
      this.hasHistoryMode = permission.modes.indexOf('History Mode') !== -1;
      if (!this.hasNormalMode) {
        this.mode = FilterMode.History;
        this.filterService.checkYesterdayDataWarehouseIsReady().subscribe(isReady => this.isYerterdayDataWarehouseReady = isReady);
      }
      if (!this.hasHistoryMode) {
        this.reportTypeSelectItems = this.reportTypeSelectItems.filter(x => x.value !== ReportType.Monthly);
      }
      const products = data[1];
      const isHasAll = permission.products.filter(product => product === 'All').length > 0;
      if (isHasAll) {
        this.products = products;

      } else {
        const productsHasPermission = products.filter(product => permission.products.indexOf(product.productName) !== -1);
        this.products = productsHasPermission;
      }

      this.selectedProducts = JSON.parse(localStorage.getItem(LocalStorageKey.PRODUCTS)) as Product[];

      if (this.selectedProducts == null || this.selectedProducts.length === 0) {
        this.selectedProducts = this.products;
      }

      this.productTreeViewItems = this.treeviewBuilderService.buildProductTreeViewItems(this.products, this.selectedProducts);
    });

    this.filterService.getDevices().subscribe(devices => {
      this.devices = devices;

      this.selectedDevices = JSON.parse(localStorage.getItem(LocalStorageKey.DEVICES)) as Device[];

      if (this.selectedDevices == null || this.selectedDevices.length === 0) {
        this.selectedDevices = devices;
      }

      this.deviceTreeViewItems = this.treeviewBuilderService.buildDeviceTreeViewItems(devices, this.selectedDevices);
    });
  }

  private createContentForSavedFilter(): string {
    const model: SavedFilterContentModel = {
      columns: localStorage.getItem(LocalStorageKey.COLUMNS),
      currencies: localStorage.getItem(LocalStorageKey.CURRENCIES),
      devices: localStorage.getItem(LocalStorageKey.DEVICES),
      exactMatching: localStorage.getItem(LocalStorageKey.EXACT_MATCHING),
      gameIncomeCompareType: localStorage.getItem(LocalStorageKey.GAME_INCOME_COMPARE_TYPE),
      gameIncomeValue: localStorage.getItem(LocalStorageKey.GAME_INCOME_VALUE),
      gameTypes: localStorage.getItem(LocalStorageKey.GAME_TYPES),
      housePtCompareType: localStorage.getItem(LocalStorageKey.HOUSEPT_COMPARE_TYPE),
      housePtValue: localStorage.getItem(LocalStorageKey.HOUSEPT_VALUE),
      isBasermCheck: localStorage.getItem(LocalStorageKey.IS_BASERM_CHECK),
      isExcludeTest: localStorage.getItem(LocalStorageKey.IS_EXCLUDE_TEST),
      isViewByInteger: localStorage.getItem(LocalStorageKey.IS_VIEW_BY_INTEGER),
      mode: localStorage.getItem(LocalStorageKey.MODE),
      products: localStorage.getItem(LocalStorageKey.PRODUCTS),
      reportType: localStorage.getItem(LocalStorageKey.REPORT_TYPE),
      roleId: localStorage.getItem(LocalStorageKey.ROLEID),
      sites: localStorage.getItem(LocalStorageKey.SITES),
      totalBetCompareType: localStorage.getItem(LocalStorageKey.TOTAL_BET_COMPARE_TYPE),
      totalBetValue: localStorage.getItem(LocalStorageKey.TOTAL_BET_VALUE),
      date: this.isNormalMode ?
        '' : `${this.timePeriod}**${DateHelper.convertDateStructToString(this.startDate)}**${DateHelper.convertDateStructToString(this.endDate)}`,
      sort: localStorage.getItem(LocalStorageKey.SORT)
    };
    return JSON.stringify(model);
  }

  private reloadFilter(content: string) {
    const model = JSON.parse(content) as SavedFilterContentModel;
    localStorage.setItem(LocalStorageKey.COLUMNS, model.columns);
    localStorage.setItem(LocalStorageKey.CURRENCIES, model.currencies);
    localStorage.setItem(LocalStorageKey.DEVICES, model.devices);
    localStorage.setItem(LocalStorageKey.EXACT_MATCHING, model.exactMatching);
    localStorage.setItem(LocalStorageKey.GAME_INCOME_COMPARE_TYPE, model.gameIncomeCompareType);
    localStorage.setItem(LocalStorageKey.GAME_INCOME_VALUE, model.gameIncomeValue);
    localStorage.setItem(LocalStorageKey.GAME_TYPES, model.gameTypes);
    localStorage.setItem(LocalStorageKey.HOUSEPT_COMPARE_TYPE, model.housePtCompareType);
    localStorage.setItem(LocalStorageKey.HOUSEPT_VALUE, model.housePtValue);
    localStorage.setItem(LocalStorageKey.IS_BASERM_CHECK, model.isBasermCheck);
    localStorage.setItem(LocalStorageKey.IS_EXCLUDE_TEST, model.isExcludeTest);
    localStorage.setItem(LocalStorageKey.IS_VIEW_BY_INTEGER, model.isViewByInteger);
    localStorage.setItem(LocalStorageKey.MODE, model.mode);
    localStorage.setItem(LocalStorageKey.PRODUCTS, model.products);
    localStorage.setItem(LocalStorageKey.REPORT_TYPE, model.reportType);
    localStorage.setItem(LocalStorageKey.ROLEID, model.roleId);
    localStorage.setItem(LocalStorageKey.SITES, model.sites);
    localStorage.setItem(LocalStorageKey.TOTAL_BET_COMPARE_TYPE, model.totalBetCompareType);
    localStorage.setItem(LocalStorageKey.TOTAL_BET_VALUE, model.totalBetValue);
    localStorage.setItem(LocalStorageKey.SORT, model.sort);
    this.userNameSuggestion.reset();
    this.initFilter();
    if (model.date.length > 0) {
      const date = model.date.split('**');
      this.timePeriod = JSON.parse(date[0]) as TimePeriod;
      if (this.timePeriod === TimePeriod.SpecificDate) {
        this.startDate = DateHelper.convertStringToDateStruct(date[1]);
        this.endDate = DateHelper.convertStringToDateStruct(date[2]);
      } else {
        this.onTimePeriodChange();
      }
    }
  }
}
