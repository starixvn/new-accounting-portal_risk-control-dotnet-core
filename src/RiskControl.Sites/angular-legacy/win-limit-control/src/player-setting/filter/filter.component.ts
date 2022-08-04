import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { TypeaheadQuery } from 'nap-components/dropdown-typeahead';
import { FilterModel } from './filter.model';
import { Product, Currency, Site, QueryCurrencyModel, FilterService, FilterHelper } from '../../common/filter';

@Component({
    selector: 'nap-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    providers: [
        FilterService
    ]
})
export class FilterComponent implements OnInit {
    @Output() generate = new EventEmitter<FilterModel>();
    userName: string;
    userNameTypeaheadQuery: TypeaheadQuery;
    products: Product[];
    productId: number;
    sites: TreeviewItem[];
    siteId: number;
    currencies: Currency[];
    currencyId: number;
    private creditSites: Site[];
    private defaultCurrencyQueryModel: QueryCurrencyModel = {
        excludeTestCurrency: false,
        isCreditSite: false,
        siteId: 0
    };

    constructor(
        private filterService: FilterService
    ) { }

    ngOnInit() {
        this.userNameTypeaheadQuery = this.filterService.createUserNameTypeaheadQuery();
        this.filterService.queryProducts().subscribe(products => {
            this.products = FilterHelper.insertProductAll(products);
            this.productId = this.products[0].id;
        });
        this.querySite();
        this.queryCurrencies(this.defaultCurrencyQueryModel);
    }

    onProductChange() {
        this.siteId = undefined;
        this.currencyId = 0;
        this.querySite();
        this.queryCurrencies(this.defaultCurrencyQueryModel);
    }

    onSiteSelectedChange() {
        const isCreditSite = this.creditSites.filter(site => site.siteId === this.siteId).length > 0;
        const currencyQueryModel: QueryCurrencyModel = {
            isCreditSite: isCreditSite,
            siteId: this.siteId
        };
        this.queryCurrencies(currencyQueryModel);
    }

    search() {
        const filterModel: FilterModel = {
            userName: this.userName,
            productId: this.productId,
            siteId: this.siteId,
            currencyId: this.currencyId
        };
        this.generate.emit(filterModel);
    }

    private querySite() {
        this.filterService.querySites(this.productId).subscribe(siteGroups => {
            const creditSiteGroups = siteGroups.filter(group => FilterHelper.isCreditSiteGroup(group.groupName));
            this.creditSites = creditSiteGroups.length === 1 ? creditSiteGroups[0].sites : [];
            this.sites = FilterHelper.convertSiteToTreeviewItem(siteGroups);
        });
    }

    private queryCurrencies(currencyQueryModel: QueryCurrencyModel) {
        this.filterService.queryCurrencies(currencyQueryModel).subscribe(currencies => {
            this.currencies = FilterHelper.insertCurrencyAll(currencies);
            this.currencyId = this.currencies[0].id;
        });
    }
}
