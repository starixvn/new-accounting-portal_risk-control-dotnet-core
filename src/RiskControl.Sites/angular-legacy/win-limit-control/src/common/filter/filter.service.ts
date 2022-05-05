import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { TreeviewItem } from 'ngx-treeview';
import { HttpService } from 'nap-components/http';
import { TypeaheadQuery } from 'nap-components/dropdown-typeahead';
import { LimitLevel, Product, SiteGroup, Currency, QueryCurrencyModel } from './filter.model';

@Injectable()
export class FilterService {
    constructor(
        private httpService: HttpService
    ) { }

    limitLevels: TreeviewItem[] = [
        new TreeviewItem({ text: 'Black', value: LimitLevel.Black }),
        new TreeviewItem({ text: 'Grey', value: LimitLevel.Grey }),
        new TreeviewItem({ text: 'Orange', value: LimitLevel.Orange }),
        new TreeviewItem({ text: 'Yellow', value: LimitLevel.Yellow }),
        new TreeviewItem({ text: 'Red', value: LimitLevel.Red })
    ];

    queryProducts(): Observable<Product[]> {
        const url = 'api/win-limit-control/filter/get-products';
        return this.httpService.post<Product[]>(url);
    }

    querySites(productId: number): Observable<SiteGroup[]> {
        const url = 'api/win-limit-control/filter/get-sites';
        return this.httpService.post<SiteGroup[]>(url, { productId: productId });
    }

    queryCurrencies(model: QueryCurrencyModel): Observable<Currency[]> {
        const url = 'api/win-limit-control/filter/get-currencies';
        return this.httpService.post<Currency[]>(url, model);
    }

    queryUserName(term: string): Observable<string[]> {
        const url = `api/win-limit-control/filter/search-users?term=${term}`;
        return this.httpService.get<string[]>(url, null, {
            noSpinner: true,
            noToast: true
        });
    }

    createUserNameTypeaheadQuery(): TypeaheadQuery {
        return new TypeaheadQuery(term => {
            return this.queryUserName(term);
        });
    }
}
