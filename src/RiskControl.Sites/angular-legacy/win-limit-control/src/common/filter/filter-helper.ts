import { TreeviewItem } from 'ngx-treeview';
import { Product, Currency, SiteGroup } from './filter.model';

export const AllProductId = 0;
export const AllCurrencyId = 0;
export const FilterHelper = {
    insertProductAll: insertProductAll,
    insertCurrencyAll: insertCurrencyAll,
    convertSiteToTreeviewItem: convertSiteToTreeviewItem,
    isCreditSiteGroup: isCreditSiteGroup
};

function insertProductAll(products: Product[]): Product[] {
    const allProducts: Product[] = [{
        Id: AllProductId,
        Name: 'All'
    }];
    return allProducts.concat(products);
}


function insertCurrencyAll(products: Currency[]): Currency[] {
    const allCurrencies: Currency[] = [{
        Id: AllCurrencyId,
        Name: 'All'
    }];
    return allCurrencies.concat(products);
}

function convertSiteToTreeviewItem(siteGroups: SiteGroup[]): TreeviewItem[] {
    return siteGroups.map(siteGroup => {
        return new TreeviewItem({
            text: siteGroup.GroupName,
            value: siteGroup.GroupName,
            children: siteGroup.Sites.map(site => new TreeviewItem({
                text: site.SiteName,
                value: site.SiteId
            }))
        });
    });
}

function isCreditSiteGroup(groupName: string) {
    return groupName === 'Credit Sites';
}
