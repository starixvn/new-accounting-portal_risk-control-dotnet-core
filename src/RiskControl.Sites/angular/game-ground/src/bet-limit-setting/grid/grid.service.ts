import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'nap-components/http';
import { Injectable } from '@angular/core';
import { FilterModel } from '../filter/filter.model';
import { SettingModel } from './grid.model';
import { merge } from 'rxjs';
@Injectable()
export class GridService {
  constructor(private readonly httpService: HttpService) {}

  hasHostPermission(): Observable<boolean> {
    const url = `state-api/game-ground-bet-limit/host-permission`;
    return this.httpService.post<boolean>(url);
  }

  query(filterModel: FilterModel): Observable<SettingModel[]> {
    const url = `api/game-ground-bet-limit/setting-query`;
    const queryModel = {
      productId: filterModel.productIds
    };
    return this.httpService
      .post<SettingModel[]>(url, queryModel)
      .map(settings => {
        return _.sortBy(settings, ['ProductName', 'BetTypeName']);
      });
  }

  update(settings: SettingModel[]): Observable<string> {
    const url = `state-api/game-ground-bet-limit/setting-update`;
    const observables = settings.map(s => {
      return this.httpService.post<string>(url, s);
    });

    return merge(...observables);
  }
}
