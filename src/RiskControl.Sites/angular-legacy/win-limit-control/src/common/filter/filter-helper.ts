import { TreeviewItem } from 'ngx-treeview';
import { Product, Currency, SiteGroup, Group } from './filter.model';

export const AllProductId = 0;
export const AllCurrencyId = 0;
export const AllGroupId = 0;
export const FilterHelper = {
    insertProductAll: insertProductAll,
    insertCurrencyAll: insertCurrencyAll,
    convertSiteToTreeviewItem: convertSiteToTreeviewItem,
    isCreditSiteGroup: isCreditSiteGroup
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
