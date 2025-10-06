import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ApiConstants } from '../../common/constants';
import { QueryModel } from '../../app.model';

@Injectable()
export class MonthlyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: QueryModel): Observable<GridOptions> {
        return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}monthly/data`, model);
    }

    excel(model: QueryModel): Observable<Blob> {
        return this.httpService.download(`${ApiConstants.REPORT}monthly/excel`, model);
    }
}
