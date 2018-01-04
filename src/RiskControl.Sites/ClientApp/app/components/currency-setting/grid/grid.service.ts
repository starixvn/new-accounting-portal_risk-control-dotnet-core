import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService, HttpOptions, DefaultHttpOptions } from 'nap-components/http';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { ProductSetting, ProductSettingGroup } from './grid.model';

@Injectable()
export class GridService {
    constructor(
        private httpService: HttpService
    ) { }

    query(filterModel: FilterModel, httpOptions = DefaultHttpOptions): Observable<ProductSetting[]> {
        const url = 'api/win-limit-control/currency-setting/search';
        return this.httpService.post<ProductSetting[]>(url, filterModel, httpOptions);
    }

    update(settings: ProductSettingGroup[]): Observable<CommandResult> {
        const url = 'state-api/win-limit-control/currency-setting/update';
        return this.httpService.post<CommandResult>(url, settings);
    }
}
