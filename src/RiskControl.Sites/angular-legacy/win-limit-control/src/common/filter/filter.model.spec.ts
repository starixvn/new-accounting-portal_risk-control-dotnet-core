import { Product, Currency, Site, SiteGroup } from './filter.model';

export const fakeProducts: Product[] = [
    { Id: 1, Name: 'Product 1' },
    { Id: 2, Name: 'Product 2' }
];

export const fakeCurrencies: Currency[] = [
    { Id: 1, Name: 'Currency 1' },
    { Id: 2, Name: 'Currency 2' }
];

export const fakeCreditSites: Site[] = [
    { SiteId: 1, SiteName: 'Credit 1' },
    { SiteId: 2, SiteName: 'Credit 2' }
];

export const fakeDepositSites: Site[] = [
    { SiteId: 3, SiteName: 'Deposit 1' },
    { SiteId: 4, SiteName: 'Deposit 2' }
];

export const fakeCreditSiteGroup: SiteGroup = {
    GroupName: 'Credit Sites',
    Sites: fakeCreditSites
};

export const fakeDepositSiteGroup: SiteGroup = {
    GroupName: 'Deposit Sites',
    Sites: fakeDepositSites
};

export const fakeSiteGroups: SiteGroup[] = [
    fakeCreditSiteGroup,
    fakeDepositSiteGroup
];
