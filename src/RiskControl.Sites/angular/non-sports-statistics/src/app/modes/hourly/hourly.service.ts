import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { HourlyData, HourlyQueryModel } from './hourly.model';

@Injectable()
export class HourlyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: HourlyQueryModel): Observable<HourlyData> {
        const url = this.getUrl(model) + 'Query';
        return this.httpService.post<HourlyData>(url, model);
    }

    excel(model: HourlyQueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getUrl(model: HourlyQueryModel): string {
        return model.isNormalMode
            ? 'NonSportsGamesStatistics/HourlyNormal/'
            : 'NonSportsGamesStatistics/HourlyHistory/';
    }
}
