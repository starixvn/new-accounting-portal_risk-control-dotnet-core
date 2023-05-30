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
  FilterModel, ReportType, GameTypeModel, NumberGameGameType, TimeRange, SiteGroupModel, SportGameType, Column
} from './filter.model';
import { FilterHelper } from './filter-helper';
import { UserNameSuggestionTextboxComponent } from './user-name-suggestion/user-name-suggestion-textbox.component';

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
  maxEndDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.yesterday);
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
  private currencyHelper: CurrencyHelper;
  private isGenerate: boolean;
  private readonly valueRequired = 'Value is required!';
  private readonly lastWeekStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).startOf('week').subtract(1, 'week');
  private readonly lastMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(1, 'month').startOf('month');
  private readonly lastThreeMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(3, 'month').startOf('month');
  private readonly lastSixMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(6, 'month').startOf('month');
  private readonly lastYearStartDate = moment.utc(DATE_CONFIG.reportDate.today).subtract(1, 'year');
  private numberLicensees = 0;

  private readonly TimeRanges: TimeRange[] = [
    {
      timePeriodType: TimePeriod.Yesterday,
      startDate: moment.utc(DATE_CONFIG.reportDate.yesterday),
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
    },
    {
      timePeriodType: TimePeriod.CurrentWeek,
      startDate: moment.utc(DATE_CONFIG.reportDate.yesterday).startOf('week'),
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
    },
    {
      timePeriodType: TimePeriod.LastWeek,
      startDate: this.lastWeekStartDate,
      endDate: moment.utc(this.lastWeekStartDate).endOf('week')
    },
    {
      timePeriodType: TimePeriod.CurrentMonth,
      startDate: moment.utc(DATE_CONFIG.reportDate.yesterday).startOf('month'),
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
    },
    {
      timePeriodType: TimePeriod.LastMonth,
      startDate: this.lastMonthStartDate,
      endDate: moment.utc(this.lastMonthStartDate).endOf('month')
    },
    {
      timePeriodType: TimePeriod.SinceLastMonth,
      startDate: this.lastMonthStartDate,
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
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
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
    }
  ];


  constructor(
    private readonly filterService: FilterService,
    private readonly columnService: ColumnService,
    private readonly toastService: ToastService,
    private readonly treeviewBuilderService: TreeViewBuilderService
  ) { }

  ngOnInit() {
    this.initFilter();
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
        localStorage.setItem('non-sport-products', JSON.stringify(event));
      }
    }

    const productIds = this.selectedProducts.map(product => product.productId).join(',');
    this.getSites(isEqualProducts, productIds);
    this.getGameTypes(isEqualProducts);
  }

  onSiteChange(event: SiteGroupModel[]) {
    const cachedSites = JSON.parse(localStorage.getItem('non-sport-sites')) as SiteGroupModel[];
    const isEqualSites = _.isEqual(event, cachedSites);

    if (!isEqualSites) {
      if (event != null && event.length > 0) {
        localStorage.setItem('non-sport-sites', JSON.stringify(event));
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
          JSON.parse(localStorage.getItem("non-sport-currencies")) as Currency[] :
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
    }

    localStorage.setItem('non-sport-totalbetcomparetype', JSON.stringify(this.totalBetsCompareType));
  }

  onGameIncomeTypeChange() {
    if (this.gameIncomeCompareType === CompareType.None) {
      this.gameIncomeValue = undefined;
    }

    localStorage.setItem('non-sport-gameincomecomparetype', JSON.stringify(this.totalBetsCompareType));
  }

  onHousePTTypeChange() {
    if (this.housePTCompareType === CompareType.None) {
      this.housePTValue = undefined;
    }

    localStorage.setItem('non-sport-houseptcomparetype', JSON.stringify(this.totalBetsCompareType));
  }

  onHousePTChange($event: number) {
    this.housePTValue = $event;
    localStorage.setItem('non-sport-houseptvalue', JSON.stringify($event));
  }

  onReportTypeChange(newReportType: ReportType) {
    let cachedReportType = JSON.parse(localStorage.getItem("non-sport-reporttype")) as ReportType;
    const reportTypeChange = newReportType !== cachedReportType;
    const lastReportRoleId = this.reportRoleId;
    this.selectedReportType = newReportType;
    this.getColumns(reportTypeChange);
    if (this.selectedReportType === ReportType.Monthly && this.mode === FilterMode.Normal) {
      this.mode = FilterMode.History;
      localStorage.setItem('non-sport-mode', JSON.stringify(this.mode));
      this.timePeriod = TimePeriod.LastMonth;
      this.onTimePeriodChange();
    }

    this.reportRoleId = this.getReportRoleId();
    if (this.reportRoleId !== lastReportRoleId) {
      this.userNameSuggestion.reset();
    }

    localStorage.setItem('non-sport-reporttype', JSON.stringify(newReportType));
  }

  onTop20RoleIdChange(roleId: RoleId) {
    let cachedRoleId = JSON.parse(localStorage.getItem("non-sport-roleid")) as RoleId;
    if (roleId !== cachedRoleId) {
      localStorage.setItem('non-sport-roleid', JSON.stringify(roleId));
    }

    this.roleId = roleId;
    this.reportRoleId = this.getReportRoleId();
    this.userNameSuggestion.reset();
  }

  onGameTypeChange(selectedGameTypes: GameType[]) {
    if (selectedGameTypes != null && selectedGameTypes.length > 0) {
      localStorage.setItem('non-sport-gametypes', JSON.stringify(selectedGameTypes));
    }

    this.selectedGameTypes = selectedGameTypes;
  }

  onDeviceChange($event: Device[]) {
    if ($event != null && $event.length > 0) {
      localStorage.setItem('non-sport-devices', JSON.stringify($event));
    }

    this.selectedDevices = $event;
  }

  onCurrenciesChange($event: Currency[]) {
    if ($event != null && $event.length > 0) {
      localStorage.setItem('non-sport-currencies', JSON.stringify($event));
    }

    this.selectedCurrencies = $event;
  }

  onColumnChange($event: Column[]) {
    if ($event != null && $event.length > 0) {
      localStorage.setItem('non-sport-columns', JSON.stringify($event));
    }

    this.selectedColumns = $event;
  }

  gameIncomeChange($event: number) {
    this.gameIncomeValue = $event;
    localStorage.setItem('non-sport-gameincomevalue', JSON.stringify($event));
  }

  totalBetChange($event: number) {
    this.totalBetsValue = $event;
    localStorage.setItem('non-sport-totalbetvalue', JSON.stringify($event));
  }

  excludeTestChangeEvent($event: boolean) {
    this.isExcludeTest = $event;
    localStorage.setItem('non-sport-isexcludetest', JSON.stringify($event));

    const gameTypes = this.gameTypes.filter(x => !x.isTest || x.isTest === !$event);
    this.gameTypeTreeViewItems = this.treeviewBuilderService.buildGameTypeTreeViewItems(gameTypes, this.selectedProducts, gameTypes);

    const currencies = this.currencies.filter(x => !x.isTest || x.isTest === !$event);
    const copyObjects = currencies.map(object => _.cloneDeep(object));
    this.currenciesTreeViewItems = this.treeviewBuilderService.buildCurrencyTreeViewItems(copyObjects, copyObjects);
  }

  viewByIntegerChange($event: boolean) {
    this.isViewByInteger = $event;
    localStorage.setItem('non-sport-isviewbyinteger', JSON.stringify($event));
  }

  checkExactMatchingValue($event: boolean) {
    this.exactMatching = $event;
    localStorage.setItem('non-sport-exactmatching', JSON.stringify($event));
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

    localStorage.setItem('non-sport-mode', JSON.stringify(this.mode));
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
    this.initFilter();
  }

  checkBaseRMValue(isCheck: boolean) {
    this.isBaseRM = isCheck;
    localStorage.setItem('non-sport-isbasermcheck', JSON.stringify(isCheck));
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
      this.filterService.writeGameTypeLog(this.gameTypes).subscribe();
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
      totalBetValue: this.totalBetsValue,
      gameIncomeType: this.gameIncomeCompareType,
      gameIncomeValue: this.gameIncomeValue,
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
      isExactly: this.exactMatching
    };
    return model;
  }

  private getReportRoleId(): RoleId {
    let roleId = JSON.parse(localStorage.getItem("non-sport-roleid")) as RoleId;
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
          JSON.parse(localStorage.getItem('non-sport-sites')) as SiteGroupModel[] :
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
      JSON.parse(localStorage.getItem('non-sport-columns')) as Column[];
    this.columnTreeViewItems = this.columnService.buildColumnTreeViewItems(this.columns, this.selectedColumns);
  }

  private getGameTypes(isEqualProducts: boolean) {
    const uncheckedGameTypes: string[] = ['Jackpot Prize', 'Promotion', 'Tournament Prize', 'Promotion Prize'];
    this.filterService.getGameTypes().subscribe(gameTypes => {
      this.gameTypes = gameTypes;
      const defaultGameTypes = gameTypes.filter(x => !uncheckedGameTypes.includes(x.typeName));

      this.selectedGameTypes = isEqualProducts ?
        JSON.parse(localStorage.getItem('non-sport-gametypes')) as GameType[] :
        defaultGameTypes;

      if (this.selectedGameTypes == null || this.selectedGameTypes.length === 0) {
        this.selectedGameTypes = defaultGameTypes;
      }

      this.gameTypeTreeViewItems = this.treeviewBuilderService.buildGameTypeTreeViewItems(gameTypes, this.selectedProducts, this.selectedGameTypes);
    }
    );
  }

  private initFilter() {
    const isBaseRM = JSON.parse(localStorage.getItem("non-sport-isbasermcheck")) as boolean;
    this.isBaseRM = isBaseRM === null ? true : isBaseRM;

    let reportType = JSON.parse(localStorage.getItem("non-sport-reporttype")) as ReportType;

    if (reportType === null) {
      reportType = ReportType.Daily;
    }
    let roleId = JSON.parse(localStorage.getItem("non-sport-roleid")) as RoleId;

    this.roleId = roleId === null ? RoleId.Member : roleId;

    this.onReportTypeChange(reportType);

    const isExcludeTest = JSON.parse(localStorage.getItem("non-sport-isexcludetest")) as boolean;

    if (isExcludeTest !== null) {
      this.isExcludeTest = isExcludeTest;
    } else {
      this.isExcludeTest = true;
    }

    const viewByInteger = JSON.parse(localStorage.getItem('non-sport-isviewbyinteger')) as boolean;

    if (viewByInteger !== null) {
      this.isViewByInteger = viewByInteger;
    } else {
      this.isViewByInteger = false;
    }

    const exactMatching = JSON.parse(localStorage.getItem('non-sport-exactmatching')) as boolean;

    if (exactMatching !== null) {
      this.exactMatching = exactMatching;
    } else {
      this.exactMatching = true;
    }


    this.totalBetsCompareType = JSON.parse(localStorage.getItem("non-sport-totalbetcomparetype")) as CompareType;

    if (this.totalBetsCompareType === null) {
      this.totalBetsCompareType = CompareType.None;
    }

    const totalBetsValue = JSON.parse(localStorage.getItem("non-sport-totalbetvalue")) as number;

    this.totalBetsValue = totalBetsValue === null ? undefined : totalBetsValue;

    this.gameIncomeCompareType = JSON.parse(localStorage.getItem("non-sport-gameincomecomparetype")) as CompareType;

    if (this.gameIncomeCompareType === null) {
      this.gameIncomeCompareType = CompareType.None;
    }

    const gameIncomeValue = JSON.parse(localStorage.getItem("non-sport-gameincomevalue")) as number;

    this.gameIncomeValue = gameIncomeValue === null ? undefined : gameIncomeValue;

    this.housePTCompareType = JSON.parse(localStorage.getItem("non-sport-houseptcomparetype")) as CompareType;
    if (this.housePTCompareType === null) {
      this.housePTCompareType = CompareType.None;
    }

    const housePTValue = JSON.parse(localStorage.getItem("non-sport-houseptvalue")) as number;

    this.housePTValue = housePTValue === null ? undefined : housePTValue;

    forkJoin([this.filterService.getPermission(), this.filterService.getProducts()]).subscribe(data => {
      this.mode = JSON.parse(localStorage.getItem("non-sport-mode")) as FilterMode;

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

      this.selectedProducts = JSON.parse(localStorage.getItem("non-sport-products")) as Product[];

      if (this.selectedProducts == null || this.selectedProducts.length === 0) {
        this.selectedProducts = this.products;
      }

      this.productTreeViewItems = this.treeviewBuilderService.buildProductTreeViewItems(this.products, this.selectedProducts);
    });

    this.filterService.getDevices().subscribe(devices => {
      this.devices = devices;

      this.selectedDevices = JSON.parse(localStorage.getItem('non-sport-devices')) as Device[];

      if (this.selectedDevices == null || this.selectedDevices.length === 0) {
        this.selectedDevices = devices;
      }

      this.deviceTreeViewItems = this.treeviewBuilderService.buildDeviceTreeViewItems(devices, this.selectedDevices);
    });
  }
}
