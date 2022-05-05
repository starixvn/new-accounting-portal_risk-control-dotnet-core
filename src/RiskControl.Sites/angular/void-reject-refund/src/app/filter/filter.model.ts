import * as moment from 'moment';
import { CasinoType } from '../common/model';

export enum ReportType {
    Hourly,
    Daily,
    Monthly,
    Product,
    Company,
    Currency,
    Device
}

export interface TestObject {
    isTest: boolean;
}

export interface Permission {
    modes: string[];
    products: string[];
}

export interface Product {
    productId: number;
    productName: string;
    casinoType: CasinoType;
    isSingleWallet: boolean;
}

export interface Site {
    site: string;
    orderId: number;
    sortId: number;
}

export interface GameType extends TestObject {
    productId: number;
    typeName: string;
    typeId: number;
    gameType: number;
}

export interface Device {
    betFrom: string;
    fullName: string;
    groupName: string;
}

export interface BaseCurrency {
    exchangeId: number;
    currency: string;
}

export interface Currency extends BaseCurrency, TestObject { }

export enum TimePeriod {
    Yesterday,
    CurrentWeek,
    LastWeek,
    CurrentMonth,
    LastMonth,
    SinceLastMonth,
    SpecificDate,
    LastThreeMonths,
    LastSixMonths
}

export interface GameTypeModel {
    products: Product[];
    gameTypes: GameType[];
}

export interface GameTypeResult {
    productIds: number[];
    betTypes: number[];
    leagueIds: NumberGameLeagueBetType[];
    sportTypes: number[];
    gameTableIds: number[];
    sportBetTypes: SportBetType[];
}

export interface FilterCollection {
    products: Product[];
    gameTypes: GameType[];
    devices: Device[];
    currencies: Currency[];
}

export interface FilterModel {
    fromDate: string;
    toDate: string;
    reportType: ReportType;
    productIds: number[];
    sites: string[];
    betTypes: number[];
    leagueIds: NumberGameLeagueBetType[];
    sportTypes: number[];
    currency: number[];
    devices: string[];
    isExcludeTest: boolean;
    collection: FilterCollection;
    selectedCollection: FilterCollection;
    sortColumnName: string;
    sortDirection: string;
    sportBettypes: SportBetType[];
}

export interface NumberGameGameType extends GameType {
    leagueId: number;
}

export interface NumberGameLeagueBetType {
    leagueId: number;
    betType: number;
}

export class FilterModelWrapper {
    constructor(
        private readonly filterModel: FilterModel
    ) { }

    getProduct(productId: number): Product {
        return this.filterModel.selectedCollection.products.filter(product => product.productId === productId)[0];
    }

    getCurrencyName(exchangeId: number): string {
        return this.filterModel.selectedCollection.currencies.filter(currency => currency.exchangeId === exchangeId)[0].currency;
    }
}

export interface SportGameType extends GameType {
  sportType: number;
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

export interface LicenseeModel {
  licenseeId: number;
  licenseeName: string;
  groupId: number;
}

export interface SiteGroupModel {
  groupId: number;
  groupName: string;
  parentId: number;
  licenseeId: number;
  licenseeName: string;
  childGroups: SiteGroupModel[];
  childItems: LicenseeModel[];
}
