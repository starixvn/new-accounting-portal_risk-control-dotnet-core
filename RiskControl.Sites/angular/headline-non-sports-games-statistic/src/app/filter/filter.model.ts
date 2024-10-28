import * as moment from 'moment';
import { CasinoType } from '../common';

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

export enum CompareType {
    None = 0,
    GreaterOrEqual = 1,
    LessOrEqual = -1
}

export enum FilterMode {
    Normal,
    History
}

export interface TestObject {
    isTest: boolean;
}

export interface Column {
    text: string;
    value: string;
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
    productIds: number[];
    userName: string;
    sites: string[];
    betTypes: number[];
    leagueIds: NumberGameLeagueBetType[];
    sportTypes: number[];
    currency: number[];
    devices: string[];
    isExcludeTest: boolean;
    isViewByInteger: boolean;
    totalBetType: CompareType;
    totalBetValue?: number;
    gameIncomeType: CompareType;
    gameIncomeValue?: number;
    housePTType: CompareType;
    housePTValue?: number;
    removalColumns: string[];
    fromDate: moment.Moment;
    toDate: moment.Moment;
    collection: FilterCollection,
    selectedCollection: FilterCollection,
    isBaseRM: boolean,
    sportBettypes: SportBetType[];
    isExactly: boolean;
    sortDirection: string;
    sortColumnName: string;
    custId: number;
    headline: number;
    roleId: number;
    isToday: boolean;
    excludeNoData: boolean;
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
        return exchangeId === -1 ?
        'Base RM' :
        this.filterModel.selectedCollection.currencies.filter(currency => currency.exchangeId === exchangeId)[0].currency;
    }
}

export interface UsernameValidationModel {
    isCust: boolean;
    custId: string;
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

export interface ProductHaveFreeBetBetTypes {
  betTypes: GameType[];
  freeBetBetTypes: GameType[];
  otherBetTypes: GameType[];
}

export interface NumberGameBetTypes {
  numberGameBetTypes: GameType[];
  numberGameHappyFiveBetTypes: GameType[];
  numberGameHappyFiveLinkedGamesBetTypes: GameType[];
  otherBetTypes: GameType[];
}

export interface SavedFilterQueryModel {
    queryId?: number;
    queryName?: string;
    content?: string;
    reportId?: number;
    reportName?: string;
    action: number;
}

export interface SavedFilterContentModel {
    products: string | null;
    sites: string | null;
    currencies: string | null;
    totalBetCompareType: string | null;
    gameIncomeCompareType: string | null;
    housePtCompareType: string | null;
    housePtValue: string | null;
    gameTypes: string | null;
    devices: string | null;
    columns: string | null;
    gameIncomeValue: string | null;
    totalBetValue: string | null;
    isExcludeTest: string | null;
    isViewByInteger: string | null;
    excludeNoData: string | null;
    exactMatching: string | null;
    isBasermCheck: string | null;
    date: string;
    sort: string;
}
