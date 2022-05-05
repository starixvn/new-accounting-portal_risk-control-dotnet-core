import { TreeviewItem } from 'ngx-treeview';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { SelectItem } from 'nap-components/dropdown-select';
import { HttpService } from 'nap-components/http';
import { Helper } from 'nap-components/helper';
import { CasinoType, RoleId } from '../common';
import {
  Product, Site, GameType, Device, BaseCurrency, Permission,
  Currency, CompareType, TimePeriod, ReportType, UsernameValidationModel, SiteGroupModel
} from './filter.model';
import { FilterHelper } from './filter-helper';
import { FilterConfig } from './filter.config';
import { HttpParams } from '@angular/common/http';

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

  getValidUserNames(userName: string, roleId: RoleId): Observable<string> {
    const url = 'api/NonSportsGamesStatistics/Filter/UserName/GetValidUserNames';
    const model = {
      userName: userName,
      roleId: roleId
    };
    return this.httpService.post<string>(url, model);
  }

  getProducts(): Observable<Product[]> {
    const url = 'NonSportsGamesStatistics/Product/Query';
    return this.httpService.get<Product[]>(url);
  }

  getSites(productIds = ''): Observable<SiteGroupModel[]> {
    const url = 'NonSportsGamesStatistics/Site/Query';
    const params = new HttpParams();
    params.set('productId', productIds);

    const options = { params: new HttpParams().set('productId', productIds) };

    return this.httpService.get<SiteGroupModel[]>(url, options);
  }

  getGameTypes(): Observable<GameType[]> {
    const url = 'NonSportsGamesStatistics/GameType/Query';
    return this.httpService.get<GameType[]>(url);
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

  getHousePTSelectItems(): SelectItem[] {
    const selectItems: SelectItem[] = [{
      text: '',
      value: FilterConfig.housePTAllValue
    }];
    for (let i = 0; i <= 100; i += 5) {
      selectItems.push({
        text: `${i} %`,
        value: i / 100
      });
    }

    return selectItems;
  }

  getReportSelectItems(): VisibleSelectItem[] {
    const reportSelectItems = FilterHelper.getReportSelectItems();
    return reportSelectItems.map(item => {
      return {
        text: item.text,
        value: item.value,
        visible: item.value !== ReportType.Hourly && item.value !== ReportType.UserName
      } as VisibleSelectItem;
    });
  }

  getCompareTypeSelectItems(): SelectItem[] {
    return [
      { text: '', value: CompareType.None },
      { text: '>=', value: CompareType.GreaterOrEqual },
      { text: '<=', value: CompareType.LessOrEqual }
    ];
  }

  getTimePeriodSelectItems(): SelectItem[] {
    return [
      { text: 'Yesterday', value: TimePeriod.Yesterday },
      { text: 'Current Week', value: TimePeriod.CurrentWeek },
      { text: 'Last Week', value: TimePeriod.LastWeek },
      { text: 'Current Month', value: TimePeriod.CurrentMonth },
      { text: 'Last Month', value: TimePeriod.LastMonth },
      { text: 'Since Last Month', value: TimePeriod.SinceLastMonth },
      { text: 'Specific Date', value: TimePeriod.SpecificDate },
      { text: 'Last 3 Months', value: TimePeriod.LastThreeMonths },
      { text: 'Last 6 Months', value: TimePeriod.LastSixMonths }
    ];
  }

  validateUsername(userName: string): Observable<UsernameValidationModel[]> {
    const url = 'api/NonSportsGamesStatistics/Filter/UserName/ValidateUsername';
    const model = {
      userName: userName
    };
    return this.httpService.post<UsernameValidationModel[]>(url, model);
  }

  getSpecificMemberReportSelectItems(): VisibleSelectItem[] {
    const reportSelectItems = FilterHelper.getSpecificMemberReportSelectItems();
    return reportSelectItems.map(item => {
      return {
        text: item.text,
        value: item.value,
        visible: item.value !== ReportType.Hourly
      } as VisibleSelectItem;
    });
  }
}
