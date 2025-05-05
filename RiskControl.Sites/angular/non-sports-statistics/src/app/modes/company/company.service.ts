import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { BaseQueryModel } from '../../app.model';

@Injectable()
export class CompanyService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: BaseQueryModel, isDrillDownCurrency: boolean): Observable<GridOptions> {
        const url = this.getUrl(model, isDrillDownCurrency) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: BaseQueryModel, isDrillDownCurrency: boolean): Observable<Blob> {
        const url = this.getUrl(model, isDrillDownCurrency) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getUrl(model: BaseQueryModel, isDrillDownCurrency: boolean): string {
        if (isDrillDownCurrency) {
            return 'NonSportsGamesStatistics/DailyView/';
        } else {
            return 'NonSportsGamesStatistics/Company/';
        }
    }
}
