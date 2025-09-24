import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { HourlyData, HourlyQueryModel } from './hourly.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class HourlyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: HourlyQueryModel): Observable<HourlyData> {
        return this.httpService.post<HourlyData>(`${ApiConstants.REPORT}hourly/data`, model);
    }

    excel(model: HourlyQueryModel): Observable<Blob> {
        return this.httpService.download(`${ApiConstants.REPORT}hourly/excel`, model);
    }
}
