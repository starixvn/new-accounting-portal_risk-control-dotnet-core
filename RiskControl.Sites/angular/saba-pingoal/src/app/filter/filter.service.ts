import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { SelectItem } from 'nap-components/dropdown-select';
import { HttpService } from 'nap-components/http';
import { Helper } from 'nap-components/helper';
import {
  Product, GameType, Device, BaseCurrency, Permission,
  Currency, CompareType, TimePeriod, SiteGroupModel,
  CompanyModel, SportModel
} from './filter.model';
import { FilterConfig } from './filter.config';
import { HttpParams } from '@angular/common/http';
import { ApiConstants } from 'app/common/constants';

interface VisibleSelectItem extends SelectItem {
  visible: boolean;
}

@Injectable()
export class FilterService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  getPermission(): Observable<Permission> {
    const url = 'state-api/NonSportsGamesStatistics/Permission/Query';
    return this.httpService.get<Permission>(url);
  }

  getDevices(): Observable<Device[]> {
    const url = 'NonSportsGamesStatistics/Device/Query';
    return this.httpService.get<Device[]>(url);
  }

  getCurrencies(siteId: string): Observable<Currency[]> {
    const url = 'NonSportsGamesStatistics/Currency/Query';

    const options = { siteId: siteId };

    return this.httpService.post<BaseCurrency[]>(url, options)
      .map(responseCurrencies => {
        let baseCurrencies: BaseCurrency[] = [
          { exchangeId: FilterConfig.currencyAllValue, currency: 'All' },
          { exchangeId: FilterConfig.currencyBaseRM, currency: 'Base RM' }
        ];
        baseCurrencies = baseCurrencies.concat(responseCurrencies);
        const testCurrencyIds = [20, 27, 28];
        const currencies = baseCurrencies.map(currency => {
          return {
            exchangeId: currency.exchangeId,
            currency: currency.currency,
            isTest: Helper.inArray<number>(testCurrencyIds, currency.exchangeId)
          } as Currency;
        });
        return currencies;
      });
  }

  checkYesterdayDataWarehouseIsReady(): Observable<boolean> {
    const url = 'api/application/is-data-warehouse-ready';
    return this.httpService.post<boolean>(url);
  }

  getTimePeriodSelectItems(): SelectItem[] {
    return [
      { text: 'Today', value: TimePeriod.Today },
      { text: 'Yesterday', value: TimePeriod.Yesterday },
      { text: 'Current Week', value: TimePeriod.CurrentWeek },
      { text: 'Last Week', value: TimePeriod.LastWeek },
      { text: 'Current Month', value: TimePeriod.CurrentMonth },
      { text: 'Last Month', value: TimePeriod.LastMonth },
      { text: 'Since Last Month', value: TimePeriod.SinceLastMonth },
      { text: 'Specific Date', value: TimePeriod.SpecificDate },
      { text: 'Last 3 Months', value: TimePeriod.LastThreeMonths },
      { text: 'Last 6 Months', value: TimePeriod.LastSixMonths },
      { text: 'Since Last Year', value: TimePeriod.SinceLastYear },
    ];
  }

  getCompanies(): Observable<CompanyModel[]> {
    return this.httpService.post<CompanyModel[]>(`${ApiConstants.FILTER}companies`);
  }

  getSports(): Observable<SportModel[]> {
    return this.httpService.post<SportModel[]>(`${ApiConstants.FILTER}sports`);
  }
}
