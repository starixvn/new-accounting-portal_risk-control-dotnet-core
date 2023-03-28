export enum LimitLevel {
    Orange = 1,
    Yellow = 2,
    Red = 3,
    Grey = 101,
    Black = 102
}

export enum SiteType {
    Licensee,
    Credit,
    Both
}

export interface Product {
    id: number;
    name: string;
}

export interface SiteGroup {
    groupName: string;
    sites: Site[];
}

export interface Site {
    siteId: number;
    siteName: string;
    siteLabel: string;
}

export interface Currency {
    id: number;
    name: string;
}

export interface Group {
    groupId: number,
    groupName: string;
}

export interface QueryCurrencyModel {
    excludeTestCurrency?: boolean;
    isCreditSite: number;
    multiSite: string;
}
