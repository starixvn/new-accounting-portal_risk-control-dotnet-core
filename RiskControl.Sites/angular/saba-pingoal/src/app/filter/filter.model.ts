import * as moment from 'moment';

export enum ReportType {
    Hourly,
    Daily,
    Monthly,
    Product,
    Company,
    Currency,
    Device,
    Top20,
    UserName,
    ProductDetail
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
    productIds: number[];
    userName: string;
    sites: string[];
    betTypes: number[];
    sportTypes: number[];
    currency: number[];
    devices: string[];
    isExcludeTest: boolean;
    gameIncomeValue?: number;
    removalColumns: string[];
    fromDate: moment.Moment;
    toDate: moment.Moment;
    isBaseRM: boolean,
    sportBettypes: SportBetType[];
    isExactly: boolean;
    sortDirection: string;
    sortColumnName: string;
    custId: number;
    headline: number;
    roleId: number;
    excludeNoData: boolean;
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
