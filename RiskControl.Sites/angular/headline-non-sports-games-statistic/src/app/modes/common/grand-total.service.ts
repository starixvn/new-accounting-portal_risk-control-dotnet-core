import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { QueryModel } from '../../app.model';

@Injectable()
export class GrandTotalService {
  private readonly url = 'NonSportsGamesStatistics';
  private readonly dailyViewList = [0, 2, 3, 4, 5, 6, 7, 8, 9];
  private readonly productViewList = [11, 12];

  constructor(
    private readonly httpService: HttpService
  ) { }

  query( model: QueryModel): Observable<GridOptions> {
    const url = this.getGrandTotalBaseUrl() + 'Query';
    return this.httpService.post<GridOptions>(url, model);
  }

  excel(model: QueryModel): Observable<Blob> {
    const url = this.getGrandTotalBaseUrl() + 'Excel';
    return this.httpService.download(url, model);
  }

  private getGrandTotalBaseUrl(): string {
    return `${this.url}/DailyViewGrandTotalHistory/`;
  }
}
