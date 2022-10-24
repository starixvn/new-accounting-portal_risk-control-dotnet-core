import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { QueryModel } from '../../app.model';

@Injectable()
export class CompanyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: QueryModel, isDrillDownCurrency: boolean): Observable<GridOptions> {
        const url = this.getUrl(model, isDrillDownCurrency) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: QueryModel, isDrillDownCurrency: boolean): Observable<Blob> {
        const url = this.getUrl(model, isDrillDownCurrency) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getUrl(model: QueryModel, isDrillDownCurrency: boolean): string {
        if (isDrillDownCurrency) {
            return model.isNormalMode
                ? 'NonSportsGamesStatistics/DailyViewNormal/'
                : 'NonSportsGamesStatistics/DailyViewHistory/';
        } else {
            return model.isNormalMode
                ? 'NonSportsGamesStatistics/CompanyNormal/'
                : 'NonSportsGamesStatistics/CompanyHistory/';
        }
    }
}
