import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastService } from 'nap-components/toast';
import { FilterModel } from './filter.model';
import { FilterHelper, Product, SiteGroup, Site, Currency, FilterService, QueryCurrencyModel } from '../../common/filter';

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
    products: Product[];
    productId: number;
    siteGroups: SiteGroup[];
    siteId = 0;
    currencies: Currency[];
    currencyId: number;
    private creditSites: Site[];
    private defaultCurrencyQueryModel: QueryCurrencyModel = {
        excludeTestCurrency: true,
        isCreditSite: false,
        siteId: 0
    };

    constructor(
        private toastService: ToastService,
        private filterService: FilterService
    ) { }

    ngOnInit() {
        this.filterService.queryProducts().subscribe(products => {
            this.products = products;
        });
        this.queryCurrencies(this.defaultCurrencyQueryModel);
    }

    onProductChange() {
        this.siteId = 0;
        this.currencyId = 0;
        this.filterService.querySites(this.productId).subscribe(siteGroups => {
            this.siteGroups = siteGroups;
            const creditSiteGroups = siteGroups.filter(group => FilterHelper.isCreditSiteGroup(group.GroupName));
            this.creditSites = creditSiteGroups.length === 1 ? creditSiteGroups[0].Sites : [];
        });
        this.queryCurrencies(this.defaultCurrencyQueryModel);
    }

    onSiteChange() {
        const isCreditSite = this.creditSites.filter(site => site.SiteId === this.siteId).length > 0;
        const currencyQueryModel: QueryCurrencyModel = {
            isCreditSite: isCreditSite,
            siteId: this.siteId
        };
        this.queryCurrencies(currencyQueryModel);
    }

    search() {
        this.toastService.deactivate();
        if (this.productId === undefined) {
            this.toastService.activate('Please select a product');
            return;
        }

        let isCreditSite = false;
        const filteredGroups = this.siteGroups.filter(group => FilterHelper.isCreditSiteGroup(group.GroupName));
        if (filteredGroups.length > 0) {
            isCreditSite = filteredGroups[0].Sites.filter(site => site.SiteId === this.siteId).length > 0;
        }
        const productName = this.products.filter(product => product.Id === this.productId)[0].Name;
        const filterModel: FilterModel = {
            productId: this.productId,
            productName: productName,
            siteId: this.siteId,
            isCreditSite: isCreditSite,
            currencyId: this.currencyId,
            excludeTestCurrency: false
        };
        this.generate.emit(filterModel);
    }

    private queryCurrencies(currencyQueryModel: QueryCurrencyModel) {
        this.filterService.queryCurrencies(currencyQueryModel).subscribe(currencies => {
            this.currencies = FilterHelper.insertCurrencyAll(currencies);
            this.currencyId = this.currencies[0].Id;
        });
    }
}
