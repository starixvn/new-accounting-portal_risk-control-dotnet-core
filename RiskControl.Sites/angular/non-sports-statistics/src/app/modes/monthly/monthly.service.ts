import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { QueryModel } from '../../app.model';

@Injectable()
export class MonthlyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: QueryModel): Observable<GridOptions> {
        const url = this.getUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: QueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getUrl(model: QueryModel): string {
        return 'NonSportsGamesStatistics/DailyViewHistory/';
    }
}
