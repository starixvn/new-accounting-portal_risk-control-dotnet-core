import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { Observable } from 'rxjs';
import {
  CurrencyNetIncome,
  MonthlyTurnoverAndNetIncome,
  ProductTurnover,
  TopGameTypeWinning,
  TopMemberWinning,
  WinLossLimit,
  BalanceUpModel
} from './app.model';

@Injectable()
export class AppService {
  private readonly url = 'api/dashboard/';
  constructor(private readonly httpService: HttpService) {}

  queryCurrencyNetIncome(): Observable<CurrencyNetIncome[]> {
    const url = this.url + 'currency-netincome';
    return this.httpService.get<CurrencyNetIncome[]>(url);
  }

  queryMonthlyTurnoverAndNetIncome(): Observable<MonthlyTurnoverAndNetIncome[]> {
    const url = this.url + 'monthly-turnover-netincome';
    return this.httpService.get<MonthlyTurnoverAndNetIncome[]>(url);
  }

  queryProductTurnover(): Observable<ProductTurnover[]> {
    const url = this.url + 'product-turnover';
    return this.httpService.get<ProductTurnover[]>(url);
  }

  queryTopGameTypeWinning(): Observable<TopGameTypeWinning[]> {
    const url = this.url + 'top-gametype-winning';
    return this.httpService.get<TopGameTypeWinning[]>(url);
  }

  queryTopMemberWinning(): Observable<TopMemberWinning[]> {
    const url = this.url + 'top-member-winning';
    return this.httpService.get<TopMemberWinning[]>(url);
  }

  queryWinLossLimit(): Observable<WinLossLimit[]> {
    const url = this.url + 'winloss-limit';
    return this.httpService.get<WinLossLimit[]>(url);
  }

  getBalanceup(): Observable<BalanceUpModel> {
    return this.httpService.post<BalanceUpModel>('api/application/balance-up');
  }
}
