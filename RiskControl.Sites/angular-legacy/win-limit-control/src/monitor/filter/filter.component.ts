import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { ToastService } from 'nap-components/toast';
import { TypeaheadQuery } from 'nap-components/dropdown-typeahead';
import { NapDate } from 'nap-components/date';
import { TableColumn, ColumnHelper } from '../common/column';
import {
    Product, Currency, LimitLevel, Site, QueryCurrencyModel,
    FilterService, FilterHelper, AllProductId, SiteGroup, SiteType
} from '../../common/filter';
import { Columns, GridColumns } from '../common/column';
import { FilterModel } from './filter.model';
import { MemberWlAnalysisReportService } from '../member-wl-analysis-report/member-wl-analysis-report.service';

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
    siteGroups: SiteGroup[] = [];
    siteTreeviewConfig = TreeviewConfig.create({
        hasFilter: true,
        hasAllCheckBox: true,
        hasCollapseExpand: false,
        maxHeight: 500
      });
    selectedSites: number[] = [];
    sitesLength: number = 0;
    private defaultCurrencyQueryModel: QueryCurrencyModel;

    constructor(
        private toastService: ToastService,
        private filterService: FilterService,
        private readonly memberWlAnalysisReportService: MemberWlAnalysisReportService
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
            isCreditSite: SiteType.Licensee,
            multiSite: '0'
        };
    }

    ngOnInit() {
        this.userNameTypeaheadQuery = this.filterService.createUserNameTypeaheadQuery();
        this.limitLevels = this.filterService.limitLevels;
        this.selectedLimitLevels = this.limitLevels.map(level => level.value);
        this.queryProducts();
        this.querySites(0);
        this.search();
    }

    onProductChange() {
        this.currencyId = 0;
        this.querySites(this.productId);
    }

    onSiteSelectedChange(siteIds: number[]) {
        if (siteIds.length > 0) {
            this.selectedSites = siteIds;
            const currencyQueryModel: QueryCurrencyModel = {
                isCreditSite: FilterHelper.getSiteType(this.siteGroups, this.selectedSites),
                multiSite: siteIds.length === this.sitesLength ? '0' : siteIds.join(',')
            };
            this.queryCurrencies(currencyQueryModel);
        } else {
            this.selectedSites = [];
            this.initCurrencies([]);
        }
        
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

        if (this.selectedSites.length === 0) {
            this.toastService.activate('Please select at least one Site / Licensee');
            return;
        }

        const filterModel: FilterModel = {
            fromDate: this.fromDate,
            toDate: this.toDate,
            productId: this.productId,
            multiSite: this.selectedSites.length === this.sitesLength ? '0' : this.selectedSites.join(','),
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
            this.productId = this.products[0].id;
        });
        return observable;
    }

    private queryCurrencies(currencyQueryModel: QueryCurrencyModel): Observable<any> {
        const observable = this.filterService.queryCurrencies(currencyQueryModel);
        observable.subscribe(currencies => {
            this.initCurrencies(currencies);
        });
        return observable;
    }

    private querySites(productId: number): Observable<any> {
        const observable = this.filterService.querySites(productId);
        observable.subscribe(siteGroups => {
            this.currencyId = 0;
            this.siteGroups = siteGroups;
            this.sitesLength = FilterHelper.countAllSiteItems(this.siteGroups);
        });
        return observable;
    }

    private initCurrencies(currencies: Currency[]): void {
        this.currencies = FilterHelper.insertCurrencyAll(currencies);
        this.currencyId = this.currencies[0].id;
    }

    showMemberWinLossReprot(): void {
        this.memberWlAnalysisReportService.showFilter();
    }
}
