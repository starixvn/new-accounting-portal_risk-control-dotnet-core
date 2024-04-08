import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { BaseQueryModel } from '../../app.model';

@Injectable()
export class MonthlyService {
    private readonly url = 'NonSportsGamesStatistics/DailyView';
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: BaseQueryModel): Observable<GridOptions> {
        return this.httpService.post<GridOptions>(`${this.url}/Query`, model);
    }

    excel(model: BaseQueryModel): Observable<Blob> {
        return this.httpService.download(`${this.url}/Excel`, model);
    }
}
