import { TreeviewItem } from 'ngx-treeview';
import { Product, Currency, SiteGroup, Group, SiteType } from './filter.model';

export const AllProductId = 0;
export const AllCurrencyId = 0;
export const AllGroupId = 0;
export const FilterHelper = {
    insertProductAll: insertProductAll,
    insertCurrencyAll: insertCurrencyAll,
    convertSiteToTreeviewItem: convertSiteToTreeviewItem,
    isCreditSiteGroup: isCreditSiteGroup,
    getSiteType: getSiteType,
    countAllSiteItems: countAllSiteItems
};

function insertProductAll(products: Product[]): Product[] {
    const allProducts: Product[] = [{
        id: AllProductId,
        name: 'All'
    }];
    return allProducts.concat(products);
}


function insertCurrencyAll(products: Currency[]): Currency[] {
    const allCurrencies: Currency[] = [{
        id: AllCurrencyId,
        name: 'All'
    }];
    return allCurrencies.concat(products);
}

function convertSiteToTreeviewItem(siteGroups: SiteGroup[]): TreeviewItem[] {
    return siteGroups.map(siteGroup => {
        return new TreeviewItem({
            text: siteGroup.groupName,
            value: siteGroup.groupName,
            children: siteGroup.sites.map(site => new TreeviewItem({
                text: site.siteName,
                value: site.siteId
            }))
        });
    });
}

function isCreditSiteGroup(groupName: string) {
    return groupName === 'Credit Sites';
}

function getSiteType(siteGroups: SiteGroup[], selectedSites: number[]) {
    const specialLicenseeList: number[] = [557];
    let isCreditSite = false;
    let isLicenseeSite = selectedSites.filter(site => specialLicenseeList.indexOf(site) > -1).length > 0;
    const siteList = selectedSites.filter(site => specialLicenseeList.indexOf(site) === -1);
    const creditGroups = siteGroups.filter(group => FilterHelper.isCreditSiteGroup(group.groupName));
    if (creditGroups.length > 0) {
        isCreditSite = creditGroups[0].sites.filter(site => siteList.indexOf(site.siteId) > -1).length > 0;
    }
    if (isCreditSite)
    {
        if (isLicenseeSite) {
            return SiteType.Both;
        }
        const licenseeGroups = siteGroups.filter(group => !FilterHelper.isCreditSiteGroup(group.groupName));
        for (let group of licenseeGroups)
        {
            const isHasData = group.sites.filter(site => siteList.indexOf(site.siteId) > -1).length > 0;
            if (isHasData)
            {
                return SiteType.Both;
            }
        }
        return SiteType.Credit;
    }
    else {
        return SiteType.Licensee;
    }
}

function countAllSiteItems(siteGroups: SiteGroup[]) {
    let length = 0;
    siteGroups.forEach(group => {
        length += group.sites.length;
    });
    return length;
}
