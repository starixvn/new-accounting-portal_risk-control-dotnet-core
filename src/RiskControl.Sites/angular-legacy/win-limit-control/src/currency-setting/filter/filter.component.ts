import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastService } from 'nap-components/toast';
import { FilterModel } from './filter.model';
import { FilterHelper, Product, SiteGroup, Site, Currency, FilterService, QueryCurrencyModel, Group } from '../../common/filter';

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
    groups: Group[];
    groupId = 0;
    private creditSites: Site[];
    private defaultCurrencyQueryModel: QueryCurrencyModel = {
        excludeTestCurrency: true,
        isCreditSite: false,
        siteId: 0
    };

    constructor(
        private toastService: ToastService,
        private filterService: FilterService
    ) {}

    ngOnInit() {
        this.filterService.queryProducts().subscribe(products => {
            this.products = products;
        });
        this.queryCurrencies(this.defaultCurrencyQueryModel);
    }

    onProductChange() {
        this.siteId = 0;
        this.currencyId = 0;
        this.groupId = 0;
        this.filterService.querySites(this.productId).subscribe(siteGroups => {
            this.siteGroups = siteGroups;
            const creditSiteGroups = siteGroups.filter(group => FilterHelper.isCreditSiteGroup(group.groupName));
            this.creditSites = creditSiteGroups.length === 1 ? creditSiteGroups[0].sites : [];
        });
        this.queryCurrencies(this.defaultCurrencyQueryModel);
        this.queryGroups(this.productId);
    }

    onSiteChange() {
        const isCreditSite = this.creditSites.filter(site => site.siteId === this.siteId).length > 0;
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
        const filteredGroups = this.siteGroups.filter(group => FilterHelper.isCreditSiteGroup(group.groupName));
        if (filteredGroups.length > 0) {
            isCreditSite = filteredGroups[0].sites.filter(site => site.siteId === this.siteId).length > 0;
        }
        const productName = this.products.filter(product => product.id === this.productId)[0].name;
        const filterModel: FilterModel = {
            productId: this.productId,
            productName: productName,
            siteId: this.siteId,
            isCreditSite: isCreditSite,
            currencyId: this.currencyId,
            excludeTestCurrency: false,
            groupId: this.groupId
        };
        this.generate.emit(filterModel);
    }

    manageSettingGroup(): void {
        const url = window.location.href.replace('CurrencySetting', 'ManageSettingGroup');
        window.open(url);
    }

    private queryCurrencies(currencyQueryModel: QueryCurrencyModel) {
        this.filterService.queryCurrencies(currencyQueryModel).subscribe(currencies => {
            this.currencies = FilterHelper.insertCurrencyAll(currencies);
            this.currencyId = this.currencies[0].id;
        });
    }

    private queryGroups(productId: number) {
        this.filterService.queryGroups(productId).subscribe(groups => {
            this.groups = groups;
        });
    }
}
