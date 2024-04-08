import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { HourlyData, HourlyQueryModel } from './hourly.model';

@Injectable()
export class HourlyService {
    private readonly url = 'NonSportsGamesStatistics/Hourly';
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: HourlyQueryModel): Observable<HourlyData> {
        return this.httpService.post<HourlyData>(`${this.url}/Query`, model);
    }

    excel(model: HourlyQueryModel): Observable<Blob> {
        return this.httpService.download(`${this.url}/Excel`, model);
    }
}
