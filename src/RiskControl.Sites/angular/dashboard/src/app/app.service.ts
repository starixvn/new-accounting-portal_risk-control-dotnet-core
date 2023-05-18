import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { Observable } from 'rxjs';
import {
  TopGameTypeWinning,
  TopMemberWinning,
  BalanceUpModel,
  WeeklyNetIncome,
  TotalPlayersByDevice
} from './app.model';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class AppService {
  private readonly url = 'api/dashboard/';
  constructor(private readonly httpService: HttpService) {}

  queryWeeklyNetIncome(): Observable<WeeklyNetIncome[]> {
    const url = `${this.url}weekly-net-income`;
    return this.httpService.get<WeeklyNetIncome[]>(url);
  }

  queryTotalPlayersByDevice(): Observable<TotalPlayersByDevice[]> {
    const url = `${this.url}total-players-by-device`;
    return this.httpService.get<TotalPlayersByDevice[]>(url);
  }

  queryTopGameTypeWinning(): Observable<TopGameTypeWinning[]> {
    const url = this.url + 'top-gametype-winning';
    return this.httpService.get<TopGameTypeWinning[]>(url);
  }

  queryTopMemberWinning(isDeposit: boolean): Observable<TopMemberWinning[]> {
    const url = this.url + 'top-member-winning';
    const options = { params: new HttpParams().set('isDeposit', isDeposit) };

    return this.httpService.get<TopMemberWinning[]>(url, options);
  }

  getBalanceup(): Observable<BalanceUpModel> {
    return this.httpService.post<BalanceUpModel>('api/application/balance-up');
  }
}
