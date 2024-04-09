import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { DailyQueryModel } from './daily.model';

@Injectable()
export class DailyService {
    private readonly url = 'NonSportsGamesStatistics/Daily';
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: DailyQueryModel): Observable<GridOptions> {
        return this.httpService.post<GridOptions>(`${this.url}/Query`, model);
    }

    excel(model: DailyQueryModel): Observable<Blob> {
        return this.httpService.download(`${this.url}/Excel`, model);
    }
}
