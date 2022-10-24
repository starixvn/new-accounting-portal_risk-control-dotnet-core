import { Product, Currency, Site, SiteGroup } from './filter.model';

export const fakeProducts: Product[] = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' }
];

export const fakeCurrencies: Currency[] = [
    { id: 1, name: 'Currency 1' },
    { id: 2, name: 'Currency 2' }
];

export const fakeCreditSites: Site[] = [
    { siteId: 1, siteName: 'Credit 1' },
    { siteId: 2, siteName: 'Credit 2' }
];

export const fakeDepositSites: Site[] = [
    { siteId: 3, siteName: 'Deposit 1' },
    { siteId: 4, siteName: 'Deposit 2' }
];

export const fakeCreditSiteGroup: SiteGroup = {
    groupName: 'Credit Sites',
    sites: fakeCreditSites
};

export const fakeDepositSiteGroup: SiteGroup = {
    groupName: 'Deposit Sites',
    sites: fakeDepositSites
};

export const fakeSiteGroups: SiteGroup[] = [
    fakeCreditSiteGroup,
    fakeDepositSiteGroup
];
