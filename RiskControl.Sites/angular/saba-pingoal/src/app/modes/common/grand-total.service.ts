import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { QueryModel } from '../../app.model';
import { ReportType } from '../../filter/filter.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class GrandTotalService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  query(reportType: ReportType, model: QueryModel): Observable<GridOptions> {
    return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}daily/data`, model);
  }

  excel(reportType: ReportType, model: QueryModel): Observable<Blob> {
    return this.httpService.download(`${ApiConstants.REPORT}daily/excel`, model);
  }
}
