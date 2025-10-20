import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { QueryModel } from '../../app.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class DeviceService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: QueryModel, isDrillDownCurrency: boolean): Observable<GridOptions> {
            const api = isDrillDownCurrency ? 'device/data-with-drilldown' : 'device/data';
            return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}${api}`, model);
    }
    
    excel(model: QueryModel, isDrillDownCurrency: boolean): Observable<Blob> {
        const api = isDrillDownCurrency ? 'device/excel-with-drilldown' : 'device/excel';
        return this.httpService.download(`${ApiConstants.REPORT}${api}`, model);
    }
}
