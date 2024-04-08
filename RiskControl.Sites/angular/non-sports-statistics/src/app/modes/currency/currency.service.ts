import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { CurrencyQueryModel } from './currency.model';

@Injectable()
export class CurrencyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: CurrencyQueryModel): Observable<GridOptions> {
        const url = this.getUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: CurrencyQueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    queryGrandTotal(model: CurrencyQueryModel): Observable<GridOptions> {
        const url = this.getUrl(model, true) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excelGrandTotal(model: CurrencyQueryModel): Observable<Blob> {
        const url = this.getUrl(model, true) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getUrl(model: CurrencyQueryModel, isGrandTotal = false): string {
      if (isGrandTotal) {
          return 'NonSportsGamesStatistics/CurrencyViewGrandTotal/';
      } else {
          return 'NonSportsGamesStatistics/CurrencyView/';
      }
  }
}
