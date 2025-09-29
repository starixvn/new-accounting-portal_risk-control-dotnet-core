import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DropdownTreeviewComponent, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Column, CompanyModel, Currency, Device, FilterModel, LeagueGroupModel,ReportType, SportModel, TimePeriod, TimeRange } from './filter.model';
import { DATE_CONFIG } from '../common/date-config';
import { NapDateStruct, DateHelper } from 'nap-components/date';
import { FilterConfig } from './filter.config';
import * as moment from 'moment';
import { FilterService } from './filter.service';
import { ColumnService } from './column.service';
import { ToastService } from 'nap-components/toast';
import { TreeViewBuilderService } from './treeview-builder.service';
import * as _ from 'lodash';
import { RoleId } from '../common/model';
import { UserNameSuggestionTextboxComponent } from './user-name-suggestion';

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
  @ViewChild('userNameSuggestion') userNameSuggestion!: UserNameSuggestionTextboxComponent;
  @Output() generate = new EventEmitter<FilterModel>();
  @Output() reset = new EventEmitter();
  today = DATE_CONFIG.reportDate.today;
  yesterday = DATE_CONFIG.reportDate.yesterday;
  isExcludeTest = true;
  isBaseRM = true;
  isBaseUSD = false;
  sportTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: true,
    maxHeight: 500
  });
  sports: SportModel[] = [];
  selectedSports: string[] = [];
  sportTreeViewItems: TreeviewItem[] = [];
  leagueGroupTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: true,
    maxHeight: 500
  });
  leagueGroups: LeagueGroupModel[] = [];
  selectedLeagueGroups: string[] = [];
  leagueGroupTreeViewItems: TreeviewItem[] = [];
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
  selectedCurrencies: number[] = [];
  currenciesTreeViewItems: TreeviewItem[] = [];
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
  companies: CompanyModel[] = [];
  companyTreeViewItems: TreeviewItem[] = [];
  selectedCompanies: number[] = [];
  companyTreeviewConfig = TreeviewConfig.create({
    hasCollapseExpand: true,
    hasAllCheckBox: true,
    hasFilter: true,
    maxHeight: 500
  });
  reportTypeSelectItems = this.filterService.getReportSelectItems().filter(x => x.visible);
  selectedReportType: ReportType = ReportType.Daily;
  reportRoleId!: RoleId.Member;
  private currencyHelper!: CurrencyHelper;
  private isGenerate!: boolean;
  private readonly valueRequired = 'Value is required!';
  private readonly lastWeekStartDate = moment.utc(DATE_CONFIG.reportDate.today).startOf('isoWeek').subtract(1, 'week');
  private readonly lastMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(1, 'month').startOf('month');
  private readonly lastThreeMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(3, 'month').startOf('month');
  private readonly lastSixMonthStartDate = moment.utc(DATE_CONFIG.reportDate.yesterday).subtract(6, 'month').startOf('month');
  private readonly lastYearStartDate = moment.utc(DATE_CONFIG.reportDate.today).add(1, "day").subtract(1, 'year');

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
      this.companies = companies;
      this.companyTreeViewItems = this.treeviewBuilderService.buildCompanyTreeViewItems(companies);
    });
    this.filterService.getSports().subscribe(sports => {
      this.sports = sports;
      this.sportTreeViewItems = this.treeviewBuilderService.buildSportTreeViewItems(sports);
    });
    this.filterService.getLeagueGroups().subscribe(leagueGroups => {
      this.leagueGroupTreeViewItems = this.treeviewBuilderService.buildLeagueGroupTreeViewItems(leagueGroups);
    });
    this.filterService.getDevices().subscribe(devices => {
      this.devices = devices;
      this.deviceTreeViewItems = this.treeviewBuilderService.buildDeviceTreeViewItems(devices);
    });
    this.getColumns();
    this.getCurrencies();
  }

  onSportChange(event: SportModel[]) {
    
  }

  getCurrencies() {
    this.filterService.getCurrencies('All').subscribe(currencies => {
        this.currencyHelper = new CurrencyHelper(currencies);
        const currenciesWithoutAllAndBaseRM = this.currencyHelper.getCurrenciesWithoutAllAndBaseRM();
        const currenciesData = currenciesWithoutAllAndBaseRM.filter(x => !x.isTest || x.isTest === !this.isExcludeTest);
        if (this.selectedCurrencies == null || this.selectedCurrencies.length === 0) {
          this.selectedCurrencies = currenciesWithoutAllAndBaseRM.map(currency => currency.exchangeId);
        }

        this.currenciesTreeViewItems = this.treeviewBuilderService.buildCurrencyTreeViewItems(currenciesData);
        this.currencies = currenciesWithoutAllAndBaseRM;
      });
  }

  onColumnChange($event: Column[]) {

    this.selectedColumns = $event;
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

  excludeTestChangeEvent($event: boolean) {
    this.isExcludeTest = $event;

    const currencies = this.currencies.filter(x => !x.isTest || x.isTest === !$event);
    const copyObjects = currencies.map(object => _.cloneDeep(object));
    this.currenciesTreeViewItems = this.treeviewBuilderService.buildCurrencyTreeViewItems(copyObjects);
  }
  checkExactMatchingValue($event: boolean) {
    this.exactMatching = $event;
  }

  onGenerateClick() {
    if (this.userNameSuggestion.isOpen) {
      this.isGenerate = true;
    } else {
      this.generateInternal();
    }
  }


  onDateClick(date: moment.Moment, isToday: boolean) {
    this.timePeriod = isToday ? TimePeriod.Today : TimePeriod.Yesterday;
    this.date = DateHelper.convertMomentToDateStruct(date);
    this.startDate = this.date;
    this.endDate = this.date;
    this.generateInternal();
  }

  onReportTypeChange(newReportType: ReportType) {
    if (newReportType === ReportType.Monthly) {
      this.timePeriod = TimePeriod.CurrentMonth;
      this.onTimePeriodChange();
    }
    this.selectedReportType = newReportType;
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
    this.userNameSuggestion.reset();
  }

  checkBaseRMValue(isCheck: boolean) {
    this.isBaseRM = isCheck;
    this.isBaseUSD = this.isBaseRM ? false : this.isBaseUSD;
  }

  checkBaseUSDValue(isCheck: boolean) {
    this.isBaseUSD = isCheck;
    this.isBaseRM = this.isBaseUSD ? false : this.isBaseRM;
  }

  private generateInternal() {
    this.reset.emit();
    if (!this.isValid) {
      return;
    }

    const model = this.createModel();
    this.generate.emit(model);
  }

  private get isValidSport(): boolean {
    if (this.selectedSports.length === 0) {
      this.toastService.activate(`Please select at least one sport!`);
      return false;
    }

    return true;
  }

  private get isValidLeagueGroup(): boolean {
    if (this.selectedLeagueGroups.length === 0) {
      this.toastService.activate(`Please select at least one league group!`);
      return false;
    }

    return true;
  }

  private get isValidSite(): boolean {
    if (this.selectedCompanies.length === 0) {
      this.toastService.activate(`Please select at least one company!`);
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

  private get isValidCurrency(): boolean {
    if (this.selectedCurrencies.length === 0 && !this.isBaseRM && !this.isBaseUSD) {
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
      this.isValidSport &&
      this.isValidLeagueGroup &&
      this.isValidSite &&
      this.isValidDevice &&
      this.isValidCurrency;
  }

  private createModel() {
    const model: FilterModel = {
        fromDate: DateHelper.convertDateStructToMoment(this.startDate),
        toDate: DateHelper.convertDateStructToMoment(this.endDate),
        currency: this.getCurrenciesModel(),
        site: this.selectedCompanies.join(','),
        device: this.selectedDevices.map(device => device.betFrom).join(','),
        userName: this.username,
        sportBettype: this.selectedSports.join(','),
        leagueGroup: this.selectedLeagueGroups.join(','),
        reportType: this.selectedReportType,
        isExactly: this.exactMatching,
        removalColumns: this.columnDropdownTreeview.items
          .filter(item => item.checked === false)
          .map(item => item.value.value),
        isDrillDown: false,
        userNameDrillDown: false,
        isGrandTotal: false,
        excludeTest: this.isExcludeTest,
        sortDirection: this.sortDirection,
        sortColumnName: this.sortColumnName,
        headerText: this.getHeaderText(),
        currencyList: this.currencyHelper ? this.currencyHelper.getAllOfCurrencies() : [],
        sportList: this.sports,
        companyList: this.companies,
        leagueId: ''
      }
      return model;
    }

  private getHeaderText(): string {
    switch (this.selectedReportType) {
      case ReportType.Daily:
        return 'Date';
      case ReportType.Sport:
        return 'Sport';
      case ReportType.Monthly:
        return 'Month';
      case ReportType.Company:
        return 'Company';
    }
    return 'Sport';
  }

  private getCurrenciesModel(): string {
    if (this.isBaseRM) {
      return '-1';
    }

    if (this.isBaseUSD) {
      return '-2';
    }

    return this.selectedCurrencies.join(',');
  }

  private getColumns() {
    const columns = this.columnService.getColumns();
    this.columns = columns;
    this.columnTreeViewItems = this.columnService.buildColumnTreeViewItems(this.columns);
  }
}
