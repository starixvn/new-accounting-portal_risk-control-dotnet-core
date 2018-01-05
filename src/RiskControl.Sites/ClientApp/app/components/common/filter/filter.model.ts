export enum LimitLevel {
    Orange = 1,
    Yellow = 2,
    Red = 3,
    Grey = 101,
    Black = 102
}

export interface Product {
    Id: number;
    Name: string;
}

export interface SiteGroup {
    GroupName: string;
    Sites: Site[];
}

export interface Site {
    SiteId: number;
    SiteName: string;
}

export interface Currency {
    Id: number;
    Name: string;
}

export interface QueryCurrencyModel {
    excludeTestCurrency?: boolean;
    isCreditSite: boolean;
    siteId: number | undefined;
}
