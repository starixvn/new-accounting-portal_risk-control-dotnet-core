import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { DailyQueryModel } from './daily.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class DailyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: DailyQueryModel): Observable<GridOptions> {
        return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}daily/data`, model);
    }

    excel(model: DailyQueryModel): Observable<Blob> {
        return this.httpService.download(`${ApiConstants.REPORT}daily/excel`, model);
    }
}
