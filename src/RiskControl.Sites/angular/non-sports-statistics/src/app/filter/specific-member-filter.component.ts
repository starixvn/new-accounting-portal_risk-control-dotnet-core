import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { ToastService } from 'nap-components/toast';
import { TreeItem, DropdownTreeviewComponent, TreeviewConfig } from 'ngx-treeview';
import { NapDateStruct, DateHelper } from 'nap-components/date';
import { ProductId, RoleId, DATE_CONFIG, GameTypeId } from '../common';
import { FilterConfig } from './filter.config';
import { FilterService } from './filter.service';
import { ColumnService } from './column.service';
import {
  Product, GameType, Device, Currency, CompareType, FilterMode, TimePeriod,
  FilterModel, ReportType, GameTypeModel, NumberGameGameType, TimeRange, LicenseeModel, SiteGroupModel, SportGameType
} from './filter.model';
import { FilterHelper } from './filter-helper';

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
  selector: 'nap-specific-member-filter',
  templateUrl: './specific-member-filter.component.html',
  styleUrls: [
    './filter.component.scss'
  ],
  providers: [
    ColumnService
  ]
})
export class SpecificMemberFilterComponent implements OnInit {
  @ViewChild('productDropdownTreeview', { static: true }) productDropdownTreeview: DropdownTreeviewComponent;
  @ViewChild('columnDropdownTreeview', { static: true }) columnDropdownTreeview: DropdownTreeviewComponent;
  @ViewChild('siteDropdownTreeview', { static: true }) siteDropdownTreeview: DropdownTreeviewComponent;
  @Output() generate = new EventEmitter<FilterModel>();
  @Output() reset = new EventEmitter();
  today = DATE_CONFIG.reportDate.today;
  yesterday = DATE_CONFIG.reportDate.yesterday;
  mode: FilterMode = FilterMode.History;
  isExcludeTest = true;
  isViewByInteger = false;
  isBaseRM = true;
  productTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: false,
    maxHeight: 500
  });
  products: Product[] = [];
  gameTypeTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: true,
    maxHeight: 500
  });
  selectedProducts: Product[] = [];
  gameTypes: GameType[] = [];
  selectedGameTypes: GameType[] = [];
  devices: Device[] = [];
  selectedDevices: Device[] = [];
  sites: SiteGroupModel[] = [];
  selectedSites: LicenseeModel[] = [];
  siteTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  columns: TreeItem[] = [];
  currenciesTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  currencies: Currency[] = [];
  selectedCurrencies: Currency[];
  reportTypeSelectItems = this.filterService.getSpecificMemberReportSelectItems().filter(x => x.visible);
  selectedReportType: ReportType = ReportType.SpecificMember;
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
  startDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  endDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  minDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.moveBetDate.add('1', 'day'));
  maxDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  username = '';
  timePeriodSelectItems = this.filterService.getTimePeriodSelectItems();
  timePeriod: TimePeriod = TimePeriod.Today;
  isYerterdayDataWarehouseReady = true;
  roleId = RoleId.Member;
  reportRoleId = RoleId.Member;
  private currencyHelper: CurrencyHelper;
  isValidCust: boolean;
  custId: string;

  private readonly lastWeekStartDate = moment.utc(DATE_CONFIG.reportDate.today).startOf('week').subtract(1, 'week');
  private readonly lastMonthStartDate = moment.utc(DATE_CONFIG.reportDate.today).subtract(1, 'month').startOf('month');
  private readonly lastThreeMonthStartDate = moment.utc(DATE_CONFIG.reportDate.today).subtract(3, 'month').startOf('month');
  private readonly lastSixMonthStartDate = moment.utc(DATE_CONFIG.reportDate.today).subtract(6, 'month').startOf('month');
  private numberLicensees = 0;

  private readonly TimeRanges: TimeRange[] = [
    {
      timePeriodType: TimePeriod.Yesterday,
      startDate: moment.utc(DATE_CONFIG.reportDate.yesterday),
      endDate: moment.utc(DATE_CONFIG.reportDate.yesterday)
    },
    {
      timePeriodType: TimePeriod.Today,
      startDate: moment.utc(DATE_CONFIG.reportDate.today),
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    },
    {
      timePeriodType: TimePeriod.CurrentWeek,
      startDate: moment.utc(DATE_CONFIG.reportDate.today).startOf('week'),
      endDate: moment.utc(DATE_CONFIG.reportDate.today)
    },
    {
      timePeriodType: TimePeriod.LastWeek,
      startDate: this.lastWeekStartDate,
      endDate: moment.utc(this.lastWeekStartDate).endOf('week')
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
    }
  ];

  constructor(
    private readonly filterService: FilterService,
    private readonly columnService: ColumnService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    this.timePeriodSelectItems.unshift({ text: 'Today', value: TimePeriod.Today });
    this.onReportTypeChange(ReportType.SpecificMember);

    forkJoin([this.filterService.getPermission(), this.filterService.getProducts()]).subscribe(data => {
      const permission = data[0];
      this.mode = FilterMode.History;
      const products = data[1];
      const isHasAll = permission.products.filter(product => product === 'All').length > 0;
      if (isHasAll) {
        this.products = products;
      } else {
        const productsHasPermission = products.filter(product => permission.products.indexOf(product.productName) !== -1);
        this.products = productsHasPermission;
      }
    });
    this.filterService.getGameTypes().subscribe(gameTypes => {
      this.gameTypes = gameTypes;
    });
    this.filterService.getDevices().subscribe(devices => {
      this.devices = devices;
      this.selectedDevices = devices;
    });
  }

  onProductChange(event: Product[]) {
    this.selectedProducts = event;
    const productIds = this.selectedProducts.map(product => product.productId).join(',');
    if (productIds === '') {
      this.sites = [];
    } else {
      this.filterService.getSites(productIds).subscribe(sites => {
        this.sites = sites;
        this.countingNumberLicensees(sites);
      });
    }
  }

  onSiteChange(event: LicenseeModel[]) {
    this.selectedSites = event.filter(x => x.licenseeId !== undefined);

    if (event.length === 0) {
      this.currencies = [];
    } else {
      const siteIds = _.uniq(this.selectedSites.map(site => site.licenseeId));
      const siteIdsValue = this.numberLicensees === this.selectedSites.length
        ? 'All'
        : siteIds.join(',');
      this.filterService.getCurrencies(siteIdsValue).subscribe(currencies => {
        this.currencyHelper = new CurrencyHelper(currencies);
        this.currencies = this.currencyHelper.getCurrenciesWithoutAllAndBaseRM();
      });
    }
  }

  get isNormalMode(): boolean {
    return this.mode === FilterMode.Normal;
  }

  onGenerateClick() {
    this.reset.emit();

    if (!this.isValid) {
      return;
    }

    this.validateUsernameAndGenerated();
  }

  onGameTypeChange(selectedGameTypes: GameType[]) {
    this.selectedGameTypes = selectedGameTypes;
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

  onReportTypeChange(reportType: ReportType) {
    this.selectedReportType = reportType;
    const columns = this.columnService.getColumns(this.selectedReportType, this.isNormalMode);
    this.columns = this.columnService.generateTreeItems(columns);
  }

  private get isValid(): boolean {
    const maxDate = DateHelper.convertDateStructToMoment(this.startDate).add(6, 'month');
    if (!DateHelper.convertDateStructToMoment(this.endDate).isBefore(maxDate)) {
      this.toastService.activate(`Date range should not exceed 6 months!`);
      return false;
    }

    if (this.selectedProducts.length === 0) {
      this.toastService.activate(`Please select at least one product!`);
      return false;
    }

    if (this.username === '') {
      this.toastService.activate(`Username is required!`);
      return false;
    }

    if (this.selectedSites.length === 0) {
      this.toastService.activate(`Please select at least one company!`);
      return false;
    }

    if (this.selectedGameTypes.length === 0) {
      this.toastService.activate(`Please select at least one game type!`);
      return false;
    }

    return true;
  }

  private createModel(): FilterModel {
    const gameTypeModel: GameTypeModel = {
      products: this.selectedProducts,
      gameTypes: this.selectedGameTypes
    };
    const gameTypeResult = FilterHelper.calculateGameTypes(gameTypeModel);
    const removalColumns = this.columnDropdownTreeview.items
      .filter(item => item.checked === false)
      .map(item => item.value);

    removalColumns.push('NoOfPlayers');

    const model: FilterModel = {
      reportType: this.selectedReportType,
      roleId: this.roleId,
      productIds: gameTypeResult.productIds,
      userName: this.isValidCust ? this.custId : this.username,
      sites: this.numberLicensees === this.selectedSites.length
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
      removalColumns: removalColumns,
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
      isExactly: false
    };

    return model;
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

  private validateUsernameAndGenerated() {
    this.filterService.validateUsername(this.username).subscribe(userNameValidation => {
      const custId = userNameValidation.map(x => x.custId).join(',');
      if (custId !== '') {
        this.isValidCust = true;
        this.custId = custId;
        const model = this.createModel();
        this.generate.emit(model);
      } else {
        this.toastService.activate(`Username is not exist!`);
        return;
      }
    });
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
}
