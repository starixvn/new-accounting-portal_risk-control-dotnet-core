import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DropdownTreeviewComponent, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Column, CompanyModel, CompareType, Currency, Device, FilterModel, GameType, GameTypeModel, NumberGameGameType, Product, SiteGroupModel, SportGameType, TimePeriod, TimeRange } from './filter.model';
import { DATE_CONFIG } from '../common/date-config';
import { NapDateStruct, DateHelper } from 'nap-components/date';
import { FilterConfig } from './filter.config';
import * as moment from 'moment';
import { FilterService } from './filter.service';
import { ColumnService } from './column.service';
import { ToastService } from 'nap-components/toast';
import { TreeViewBuilderService } from './treeview-builder.service';
import { ActionConstants, LocalStorageKey, ReportConstants } from '../common/constants';
import * as _ from 'lodash';
import { FilterHelper } from './filter-helper';
import { GameTypeId, ProductId } from '../common/model';
import { forkJoin } from 'rxjs';

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
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [
    ColumnService,
    TreeViewBuilderService
  ]
})
export class FilterComponent implements OnInit {
  @ViewChild('siteDropdownTreeview') siteDropdownTreeview!: DropdownTreeviewComponent;
  @ViewChild('productDropdownTreeview') productDropdownTreeview!: DropdownTreeviewComponent;
  @ViewChild('columnDropdownTreeview') columnDropdownTreeview!: DropdownTreeviewComponent;
  @Output() generate = new EventEmitter<FilterModel>();
  @Output() reset = new EventEmitter();
  today = DATE_CONFIG.reportDate.today;
  yesterday = DATE_CONFIG.reportDate.yesterday;
  isExcludeTest = true;
  isViewByInteger = false;
  excludeNoData = false;
  isBaseRM = true;
  isBaseUSD = false;
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
  selectedColumns!: Column[] | null;
  columnTreeViewItems: TreeviewItem[] = [];
  currenciesTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  currencies: Currency[] = [];
  selectedCurrencies: Currency[] = [];
  currenciesTreeViewItems: TreeviewItem[] = [];
  totalBetsCompareType: CompareType = CompareType.None;
  totalBetsValue?: number;
  gameIncomeCompareType: CompareType = CompareType.None;
  gameIncomeValue?: number;
  housePTCompareType: CompareType = CompareType.None;
  housePTValue?: number;
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
  hasNormalMode = false;
  hasHistoryMode = false;
  exactMatching = true;
  sortColumnName = '';
  sortDirection = '';
  companyTreeViewItems: TreeviewItem[] = [];
  selectedCompanies: CompanyModel[] = [];
  private currencyHelper!: CurrencyHelper;
  private isGenerate!: boolean;
  private readonly valueRequired = 'Value is required!';
  private readonly lastWeekStartDate = moment.utc(DATE_CONFIG.reportDate.today).startOf('isoWeek').subtract(1, 'week');
  private readonly lastMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(1, 'month').startOf('month');
  private readonly lastThreeMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(3, 'month').startOf('month');
  private readonly lastSixMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(6, 'month').startOf('month');
  private readonly lastYearStartDate = moment.utc(DATE_CONFIG.reportDate.today).add(1, "day").subtract(1, 'year');
  private numberLicensees = 0;

  private readonly TimeRanges: TimeRange[] = [
    {
      timePeriodType: TimePeriod.Yesterday,
      startDate: moment.utc(DATE_CONFIG.reportDate.yesterday),
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
    },
    {
      timePeriodType: TimePeriod.CurrentWeek,
      startDate: moment.utc(DATE_CONFIG.reportDate.today).startOf('isoWeek'),
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
    },
    {
      timePeriodType: TimePeriod.Today,
      startDate: moment.utc(DATE_CONFIG.reportDate.today),
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    }
  ];


  constructor(
    private readonly filterService: FilterService,
    private readonly columnService: ColumnService,
    private readonly toastService: ToastService,
    private readonly treeviewBuilderService: TreeViewBuilderService
  ) { }

  ngOnInit() {
    this.filterService.getCompanies().subscribe(companies => {
      this.companyTreeViewItems = this.treeviewBuilderService.buildCompanyTreeViewItems(companies);
    });
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
  }

  onCompanyChange(event: CompanyModel[]) {
    if (this.selectedCompanies.length === 0) {
      this.currencies = [];
    } else {
      const companyIds = _.uniq(this.selectedCompanies.map(company => company.siteId));
      const companyIdsValue = this.numberLicensees === this.selectedCompanies.filter(x => x.siteId !== 0).length
        ? 'All'
        : companyIds.join(',');
      this.filterService.getCurrencies(companyIdsValue).subscribe(currencies => {
        this.currencyHelper = new CurrencyHelper(currencies);
        const currenciesWithoutAllAndBaseRM = this.currencyHelper.getCurrenciesWithoutAllAndBaseRM();
        const currenciesData = currenciesWithoutAllAndBaseRM.filter(x => !x.isTest || x.isTest === !this.isExcludeTest);
        this.selectedCurrencies = currenciesData;
        if (this.selectedCurrencies == null || this.selectedCurrencies.length === 0) {
          this.selectedCurrencies = currenciesWithoutAllAndBaseRM;
        }

        this.currenciesTreeViewItems = this.treeviewBuilderService.buildCurrencyTreeViewItems(currenciesData);
        this.currencies = currenciesWithoutAllAndBaseRM;
      });
    }
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

  excludeNoDataChange($event: boolean) {
    this.excludeNoData = $event;
    localStorage.setItem(LocalStorageKey.EXCLUDE_NO_DATA, JSON.stringify($event));
  }

  checkExactMatchingValue($event: boolean) {
    this.exactMatching = $event;
    localStorage.setItem(LocalStorageKey.EXACT_MATCHING, JSON.stringify($event));
  }

  onGenerateClick() {
    this.generateInternal();
  }


  onDateClick(date: moment.Moment) {
    this.date = DateHelper.convertMomentToDateStruct(date);
    this.generateInternal();
  }

  onTimePeriodChange() {
    const timePeriod = this.timePeriod;
    const timmePeriodData = _.find(this.TimeRanges, function (period) {
      return period.timePeriodType === timePeriod;
    });

    if (!_.isNil(timmePeriodData!.startDate) && !_.isNil(timmePeriodData!.endDate)) {
      this.startDate = DateHelper.convertMomentToDateStruct(timmePeriodData!.startDate);
      this.endDate = DateHelper.convertMomentToDateStruct(timmePeriodData!.endDate);
    }
  }

  onDateChange() {
    this.timePeriod = TimePeriod.SpecificDate;
  }

  onResetClick() {
    localStorage.clear();
  }

  checkBaseRMValue(isCheck: boolean) {
    this.isBaseRM = isCheck;
    this.isBaseUSD = this.isBaseRM ? false : this.isBaseUSD;
    localStorage.setItem(LocalStorageKey.IS_BASERM_CHECK, JSON.stringify(isCheck));
    localStorage.setItem(LocalStorageKey.IS_BASEUSD_CHECK, JSON.stringify(this.isBaseUSD));
  }

  checkBaseUSDValue(isCheck: boolean) {
    this.isBaseUSD = isCheck;
    this.isBaseRM = this.isBaseUSD ? false : this.isBaseRM;
    localStorage.setItem(LocalStorageKey.IS_BASEUSD_CHECK, JSON.stringify(isCheck));
    localStorage.setItem(LocalStorageKey.IS_BASERM_CHECK, JSON.stringify(this.isBaseRM));
  }

  private generateInternal() {
    this.reset.emit();
    if (!this.isValid) {
      return;
    }

    const model = this.createModel();
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
    if (this.housePTCompareType !== CompareType.None
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
    const maxDate = DateHelper.convertDateStructToMoment(this.startDate).add(12, 'month');
    if (!DateHelper.convertDateStructToMoment(this.endDate).isBefore(maxDate)) {
      this.toastService.activate(`Date range should not exceed 12 months!`);
      return false;
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
    const sort = localStorage.getItem(LocalStorageKey.SORT);
    const model: FilterModel = {
      productIds: gameTypeResult.productIds,
      userName: this.username,
      sites: this.numberLicensees === this.selectedSites.filter(x => x.licenseeId !== 0).length
        ? ['All']
        : this.selectedSites.map(site => site.licenseeName),
      betTypes: gameTypeResult.betTypes,
      leagueIds: gameTypeResult.leagueIds,
      sportTypes: gameTypeResult.sportTypes,
      currency: this.getCurrenciesModel(),
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
      fromDate: DateHelper.convertDateStructToMoment(this.startDate),
      toDate: DateHelper.convertDateStructToMoment(this.endDate),
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
      sortColumnName: this.sortColumnName,
      sortDirection: this.sortDirection,
      custId: 0,
      headline: 0,
      roleId: 0,
      excludeNoData: this.excludeNoData
    };
    return model;
  }

  private getCurrenciesModel(): number[] {
    if (this.isBaseRM) {
      return [-1];
    }

    if (this.isBaseUSD) {
      return [-2];
    }

    return this.selectedCurrencies.map(currency => currency.exchangeId);
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
          JSON.parse(localStorage.getItem(LocalStorageKey.SITES)!) as SiteGroupModel[] :
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

  private getColumns() {
    const columns = this.columnService.getColumns();
    this.columns = columns;
    this.selectedColumns = JSON.parse(localStorage.getItem(LocalStorageKey.COLUMNS)!) as Column[]
    this.columnTreeViewItems = this.columnService.buildColumnTreeViewItems(this.columns, this.selectedColumns);
  }
}
