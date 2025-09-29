import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ApiConstants } from '../../common/constants';
import { QueryModel } from '../../app.model';

@Injectable()
export class CompanyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: QueryModel, isDrillDownCurrency: boolean): Observable<GridOptions> {
        const api = isDrillDownCurrency ? 'company/data-with-drilldown' : 'company/data';
        return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}${api}`, model);
    }

    excel(model: QueryModel, isDrillDownCurrency: boolean): Observable<Blob> {
        const api = isDrillDownCurrency ? 'company/excel-with-drilldown' : 'company/excel';
        return this.httpService.download(`${ApiConstants.REPORT}${api}`, model);
    }
}
