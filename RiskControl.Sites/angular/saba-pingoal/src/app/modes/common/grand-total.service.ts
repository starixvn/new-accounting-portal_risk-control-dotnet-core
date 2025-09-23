import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ReportType } from '../../filter/filter.model';
import { ApiConstants } from '../../common/constants';

import { QueryModel } from 'app/app.model';

@Injectable()
export class GrandTotalService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  query(reportType: ReportType, model: any): Observable<GridOptions> {
    if (reportType === ReportType.Product) {
      const api = model && typeof model === 'object' && 'isDrillDownSport' in model && model.isDrillDownSport
        ? `${ApiConstants.REPORT}product/league/data` : `${ApiConstants.REPORT}product/data`;
      return this.httpService.post<GridOptions>(api, model);
    }
    return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}daily/data`, model);
  }

  excel(reportType: ReportType, model: any): Observable<Blob> {
    if (reportType === ReportType.Product) {
       const api = model && typeof model === 'object' && 'isDrillDownSport' in model && model.isDrillDownSport
        ? `${ApiConstants.REPORT}product/league/excel` : `${ApiConstants.REPORT}product/excel`;
      return this.httpService.download(api, model);
    }
    return this.httpService.download(`${ApiConstants.REPORT}daily/excel`, model);
  }
}
