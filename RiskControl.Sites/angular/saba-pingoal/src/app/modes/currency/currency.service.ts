import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { CurrencyQueryModel } from './currency.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class CurrencyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: CurrencyQueryModel): Observable<GridOptions> {
        return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}currency/data`, model);
    }
    
    excel(model: CurrencyQueryModel): Observable<Blob> {
        return this.httpService.download(`${ApiConstants.REPORT}currency/excel`, model);
    }
}
