import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { DailyQueryModel } from './daily.model';

@Injectable()
export class DailyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: DailyQueryModel): Observable<GridOptions> {
        const url = this.getUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: DailyQueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getUrl(model: DailyQueryModel): string {
        if (model.reportBy === 'SpecificMemberDaily') {
            return 'NonSportsGamesStatistics/SpecificMember/Daily/';
        }

        return model.isNormalMode
            ? 'NonSportsGamesStatistics/DailyNormal/'
            : 'NonSportsGamesStatistics/DailyHistory/';
    }
}
