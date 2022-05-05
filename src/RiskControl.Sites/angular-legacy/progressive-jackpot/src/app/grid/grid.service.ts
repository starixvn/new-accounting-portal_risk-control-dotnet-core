import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { HttpService, HttpOptions, DefaultHttpOptions } from 'nap-components/http';
import { Helper } from 'nap-components/helper';
import { FilterModel } from '../filter';
import { RealTimeRecord, WinnerRecord, MonthlyQueryModel, MonthlyRecord, DailyQueryModel, DailyRecord } from './grid.model';

@Injectable()
export class GridService {
  constructor(
    private httpService: HttpService
  ) { }

  queryRealTime(model: FilterModel): Observable<RealTimeRecord[]> {
    const url = 'api/progressive-jackpot/real-time';
    return this.httpService.post<RealTimeRecord[]>(url, model);
  }

  excelRealTime(model: FilterModel) {
    const url = 'api/progressive-jackpot/real-time-excel';
    return this.httpService.download(url, model).subscribe(response => {
      const fileName = `ProgressiveJackpotMonitoring_${this.getExportedDateString()}.xlsx`;
      Helper.saveExcel(response, fileName);
    });
  }

  queryWinner(model: FilterModel): Observable<WinnerRecord[]> {
    const url = 'api/progressive-jackpot/win-record';
    return this.httpService.post<WinnerRecord[]>(url, model);
  }

  excelWinner(model: FilterModel) {
    const url = 'api/progressive-jackpot/win-record-excel';
    return this.httpService.download(url, model).subscribe(response => {
      const fileName = `WinRecord_${this.getExportedDateString()}.xlsx`;
      Helper.saveExcel(response, fileName);
    });
  }

  queryMonthly(model: MonthlyQueryModel): Observable<MonthlyRecord[]> {
    const url = 'api/progressive-jackpot/monthly';
    return this.httpService.post<MonthlyRecord[]>(url, model);
  }

  excelMonthly(model: MonthlyQueryModel) {
    const url = 'api/progressive-jackpot/monthly-excel';
    return this.httpService.download(url, model).subscribe(response => {
      const fileName = `ProgressiveJackpotMonitoring_${this.getExportedDateString()}.xlsx`;
      Helper.saveExcel(response, fileName);
    });
  }

  queryDaily(model: DailyQueryModel): Observable<DailyRecord[]> {
    const url = 'api/progressive-jackpot/daily';
    return this.httpService.post<DailyRecord[]>(url, model);
  }

  excelDaily(model: DailyQueryModel) {
    const url = 'api/progressive-jackpot/daily-excel';
    return this.httpService.download(url, model).subscribe(response => {
      const fileName = `ProgressiveJackpotMonitoring_${this.getExportedDateString()}.xlsx`;
      Helper.saveExcel(response, fileName);
    });
  }

  private getExportedDateString(): string {
    return moment().format('YYYYMMDD');
  }
}
