import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastService } from 'nap-components/toast';
import { TreeItem, DropdownTreeviewComponent, TreeviewConfig } from 'ngx-treeview';
import { NapDateStruct, DateHelper, DateFormat } from 'nap-components/date';
import { FilterService } from './filter.service';
import {
  Product, GameType, Device, Currency, TimePeriod,
  FilterModel, ReportType, GameTypeModel, NumberGameGameType, TimeRange, SiteGroupModel, SportGameType
} from './filter.model';
import { FilterHelper } from './filter-helper';
import { ProductId, GameTypeId } from '../common/model';
import { DATE_CONFIG } from '../common/date-config';
import { FilterConfig } from './filter.config';

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
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  constructor(
    private readonly filterService: FilterService,
    private readonly toastService: ToastService
  ) { }

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

    if (this.selectedSites.length === 0) {
      this.toastService.activate(`Please select at least one company!`);
      return false;
    }

    if (this.selectedGameTypes.length === 0) {
      this.toastService.activate(`Please select at least one game type!`);
      return false;
    }

    if (this.selectedDevices.length === 0) {
      this.toastService.activate(`Please select at least one device!`);
      return false;
    }


    return true;
  }
  @ViewChild('siteDropdownTreeview') siteDropdownTreeview: DropdownTreeviewComponent;
  @ViewChild('productDropdownTreeview') productDropdownTreeview: DropdownTreeviewComponent;
  @Output() generated = new EventEmitter<FilterModel>();
  @Output() reset = new EventEmitter();
  today = DATE_CONFIG.reportDate.today;
  yesterday = DATE_CONFIG.reportDate.yesterday;
  isExcludeTest = true;
  productTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: false,
    maxHeight: 500
  });
  products: Product[] = [];
  selectedProducts: Product[] = [];
  gameTypeTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: true,
    maxHeight: 500
  });
  gameTypes: GameType[] = [];
  selectedGameTypes: GameType[] = [];
  deviceTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: false,
    maxHeight: 500
  });
  devices: Device[] = [];
  selectedDevices: Device[] = [];
  siteTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  sites: SiteGroupModel[] = [];
  selectedSites: SiteGroupModel[] = [];
  columns: TreeItem[] = [];
  currenciesTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  currencies: Currency[] = [];
  selectedCurrencies: Currency[];
  reportTypeSelectItems = this.filterService.getReportSelectItems().filter(x => x.visible);
  selectedReportType: ReportType = ReportType.Daily;
  date: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  minStartDate: NapDateStruct = { year: 2016, month: 1, day: 1 };
  maxEndDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.yesterday);
  startDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.yesterday);
  endDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.yesterday);
  minDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.balanceUpDate);
  maxDate: NapDateStruct = DateHelper.convertMomentToDateStruct(DATE_CONFIG.reportDate.today);
  username = '';
  timePeriodSelectItems = this.filterService.getTimePeriodSelectItems();
  timePeriod: TimePeriod = TimePeriod.Yesterday;
  isYerterdayDataWarehouseReady = true;
  private currencyHelper: CurrencyHelper;

  private readonly lastWeekStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).startOf('week').subtract(1, 'week');
  private readonly lastMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(1, 'month').startOf('month');
  private readonly lastThreeMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(3, 'month').startOf('month');
  private readonly lastSixMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(6, 'month').startOf('month');
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
    }
  ];

  ngOnInit() {
    forkJoin(this.filterService.getPermission(), this.filterService.getProducts()).subscribe(data => {
      const permission = data[0];
      this.filterService.checkYesterdayDataWarehouseIsReady().subscribe(isReady => this.isYerterdayDataWarehouseReady = isReady);
      const products = data[1];
      const isHasAll = permission.products.filter(product => product === 'All').length > 0;
      if (isHasAll) {
        this.products = products;
      } else {
        const productsHasPermission = products.filter(product => permission.products.indexOf(product.productName) !== -1);
        this.products = productsHasPermission;
      }
    });
    this.filterService.getGameTypes().subscribe(gameTypes => this.gameTypes = gameTypes);
    this.filterService.getDevices().subscribe(devices => this.devices = devices);
  }

  onReportTypeChange(newReportType: ReportType) {
    if (this.selectedReportType === ReportType.Monthly) {
      this.timePeriod = TimePeriod.LastMonth;
      this.onTimePeriodChange();
    }
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

  onSiteChange(event: SiteGroupModel[]) {
    this.selectedSites = event.filter(x => x.licenseeId !== 0)

    if (this.selectedSites.length === 0) {
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

  onGenerateClick() {
    this.reset.emit();
    if (!this.isValid) {
      return;
    }

    const model = this.createModel();
    this.generated.emit(model);
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

  private createModel(): FilterModel {
    const fromDate = DateHelper.convertDateStructToMoment(this.startDate);
    const toDate = DateHelper.convertDateStructToMoment(this.endDate);
    const gameTypeModel: GameTypeModel = {
      products: this.selectedProducts,
      gameTypes: this.selectedGameTypes
    };
    const gameTypeResult = FilterHelper.calculateGameTypes(gameTypeModel);
    const reportType = this.selectedReportType;
    const model: FilterModel = {
      fromDate: DateHelper.formatMomentDate(fromDate, DateFormat.Date),
      toDate: DateHelper.formatMomentDate(toDate, DateFormat.Date),
      reportType: reportType,
      productIds: gameTypeResult.productIds,
      sites: this.numberLicensees === this.selectedSites.length
        ? ['All']
        : this.selectedSites.map(site => site.licenseeName),
      betTypes: gameTypeResult.betTypes,
      leagueIds: gameTypeResult.leagueIds,
      sportTypes: gameTypeResult.sportTypes,
      currency: this.selectedCurrencies.map(currency => currency.exchangeId),
      devices: this.selectedDevices.map(device => device.betFrom),
      isExcludeTest: this.isExcludeTest,
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
      sortColumnName: '',
      sortDirection: '',
      sportBettypes: gameTypeResult.sportBetTypes
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
