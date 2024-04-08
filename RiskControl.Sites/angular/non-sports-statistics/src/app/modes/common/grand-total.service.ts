import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { BaseQueryModel } from '../../app.model';
import { ReportType } from '../../filter';

@Injectable()
export class GrandTotalService {
  private readonly url = 'NonSportsGamesStatistics';
  private readonly dailyViewList = [0, 2, 3, 4, 5, 6, 7, 8, 9];
  private readonly productViewList = [11, 12];

  constructor(
    private readonly httpService: HttpService
  ) { }

  query(reportType: ReportType, model: BaseQueryModel): Observable<GridOptions> {
    const url = this.getGrandTotalBaseUrl(reportType, model.isNormalMode) + 'Query';
    return this.httpService.post<GridOptions>(url, model);
  }

  excel(reportType: ReportType, model: BaseQueryModel): Observable<Blob> {
    const url = this.getGrandTotalBaseUrl(reportType, model.isNormalMode) + 'Excel';
    return this.httpService.download(url, model);
  }

  private getGrandTotalBaseUrl(reportType: ReportType, isNormalMode: boolean): string {
    if (reportType === ReportType.Daily) {
      return `${this.url}/DailyGrandTotal/`;
    } else if (this.dailyViewList.includes(reportType)) {
      return `${this.url}/DailyViewGrandTotal/`;
    } else {
      throw new Error('Not implemented yet');
    }
  }
}
