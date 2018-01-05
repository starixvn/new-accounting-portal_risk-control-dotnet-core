import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';
import { ToastService } from 'nap-components/toast';
import { TypeaheadQuery } from 'nap-components/dropdown-typeahead';
import { NapDateStruct, NapDate, DateHelper } from 'nap-components/date';
import { TableColumn, ColumnHelper } from '../common/column';
import {
    Product, Currency, LimitLevel, Site, QueryCurrencyModel,
    FilterService, FilterHelper, AllProductId
} from '../../common/filter';
import { Columns, GridColumns } from '../common/column';
import { FilterModel } from './filter.model';

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
    sites: TreeviewItem[];
    products: Product[];
    productId: number;
    currencies: Currency[];
    currencyId: number;
    fromDate: NapDate;
    toDate: NapDate;
    minDate: NapDate;
    maxDate: NapDate;
    excludeTestData: boolean;
    limitLevels: TreeviewItem[];
    selectedLimitLevels: LimitLevel[];
    userName: string;
    userNameTypeaheadQuery: TypeaheadQuery;
    columnTreeviewItems = ColumnHelper.createColumnTreeviewItems(Columns);
    siteId: number | undefined;
    private creditSites: Site[];
    private defaultCurrencyQueryModel: QueryCurrencyModel;

    constructor(
        private toastService: ToastService,
        private filterService: FilterService
    ) {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);

        this.fromDate = NapDate.fromToday();
        this.toDate = NapDate.fromToday();
        this.minDate = NapDate.fromDate(lastYear);
        this.maxDate = NapDate.fromToday();
        this.excludeTestData = true;
        this.userName = '';
        this.currencyId = 0;
        this.productId = 0;
        this.defaultCurrencyQueryModel = {
            isCreditSite: false,
            siteId: 0
        };
    }

    ngOnInit() {
        this.userNameTypeaheadQuery = this.filterService.createUserNameTypeaheadQuery();
        this.limitLevels = this.filterService.limitLevels;
        this.selectedLimitLevels = this.limitLevels.map(level => level.value);
        this.queryProducts();
        this.querySites();
        this.queryCurrencies();
        this.search();
    }

    onProductChange() {
        this.siteId = undefined;
        this.currencyId = 0;
        this.querySites(this.productId);
        this.queryCurrencies();
    }

    onSiteSelectedChange() {
        const isCreditSite = this.creditSites.filter(site => site.SiteId === this.siteId).length > 0;
        const currencyQueryModel: QueryCurrencyModel = {
            isCreditSite: isCreditSite,
            siteId: this.siteId
        };
        this.queryCurrencies(currencyQueryModel);
    }

    onColumnChange(selectedColumns: TableColumn[]) {
        ColumnHelper.updateCheckedBySelection(Columns, selectedColumns);
    }

    onLimitLevelSelectedChange(selected: LimitLevel[]) {
        this.selectedLimitLevels = selected;
    }

    search() {
        if (this.selectedLimitLevels.length === 0) {
            this.toastService.activate('Please select at least one reached limit level!');
            return;
        }

        const filterModel: FilterModel = {
            fromDate: this.fromDate,
            toDate: this.toDate,
            productId: this.productId,
            siteId: this.siteId ? this.siteId : 0,
            currencyId: this.currencyId,
            levelId: this.selectedLimitLevels,
            userName: this.userName,
            excludeTestData: this.excludeTestData,
            columns: _.cloneDeep(Columns)
        };
        this.generate.emit(filterModel);
    }

    private queryProducts(): Observable<any> {
        const observable = this.filterService.queryProducts();
        observable.subscribe(products => {
            this.products = FilterHelper.insertProductAll(products);
            this.productId = this.products[0].Id;
        });
        return observable;
    }

    private queryCurrencies(currencyQueryModel = this.defaultCurrencyQueryModel): Observable<any> {
        const observable = this.filterService.queryCurrencies(currencyQueryModel);
        observable.subscribe(currencies => {
            this.currencies = FilterHelper.insertCurrencyAll(currencies);
            this.currencyId = this.currencies[0].Id;
        });
        return observable;
    }

    private querySites(productId = AllProductId): Observable<any> {
        const observable = this.filterService.querySites(productId);
        observable.subscribe(siteGroups => {
            const creditSiteGroups = siteGroups.filter(group => FilterHelper.isCreditSiteGroup(group.GroupName));
            this.creditSites = creditSiteGroups.length === 1 ? creditSiteGroups[0].Sites : [];
            this.currencyId = 0;
            this.sites = FilterHelper.convertSiteToTreeviewItem(siteGroups);
        });
        return observable;
    }
}
