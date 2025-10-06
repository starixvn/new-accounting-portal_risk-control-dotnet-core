import * as moment from 'moment';

export enum ReportType {
    Daily,
    Sport,
    League,
    BetType,
    Monthly,
    Hourly,
    Company,
    Top20,
    UserName
}

export interface Column {
    text: string;
    value: string;
}

export interface Device {
    betFrom: string;
    fullName: string;
    groupName: string;
}

export interface BaseCurrency {
    exchangeId: number;
    currency: string;
    isTest: boolean;
}

export interface Currency extends BaseCurrency { }

export enum TimePeriod {
    Today,
    Yesterday,
    CurrentWeek,
    LastWeek,
    CurrentMonth,
    LastMonth,
    SinceLastMonth,
    SpecificDate,
    LastThreeMonths,
    LastSixMonths,
    SinceLastYear
}
export interface FilterModel {
    fromDate: moment.Moment;
    toDate: moment.Moment;
    sportBettype: string;
    userName: string;
    excludeTest: boolean;
    site: string;
    leagueGroup: string;
    currency: string;
    device: string;
    isDrillDown: boolean;
    userNameDrillDown: boolean;
    isGrandTotal: boolean;
    isExactly: boolean;
    reportType: number;
    sortDirection: string;
    sortColumnName: string;
    removalColumns: string[];
    headerText: string;
    currencyList: Currency[];
    sportList: SportModel[];
    companyList: CompanyModel[];
    leagueId: string;
    roleId: number;
}

export interface UsernameValidationModel {
    isCust: boolean;
    custId: string;
}

export interface SportBetType {
  sportType: number;
  betType: number;
}

export interface TimeRange {
  timePeriodType: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export interface CompanyModel {
  isDeposit: boolean;
  siteId: number;
  siteName: string;
  parentId: number;
}

export interface SportModel {
  sportType: number;
  betType: number;
  sportName: string;
  betTypeName: string;
}

export interface LeagueGroupModel {
    groupId: number;
    groupName: string;
}

export interface Device {
    betFrom: string;
    fullName: string;
    groupName: string;
}

export class FilterModelWrapper {
    constructor(
        private readonly filterModel: FilterModel
    ) { }

    getCurrencyName(exchangeId: number): string {
        if (exchangeId === -2) {
            return 'Base USD';
        }
        if (exchangeId === -1) { 
            return 'Base RM';
        }
        return this.filterModel.currencyList.filter(currency => currency.exchangeId === exchangeId)[0].currency;
    }
}
