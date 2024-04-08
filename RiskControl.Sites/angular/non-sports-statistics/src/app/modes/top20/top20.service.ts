import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { Top20BaseQueryModel, TopType } from './top20.model';

@Injectable()
export class Top20Service {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: Top20BaseQueryModel): Observable<GridOptions> {
        const url = this.getUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    private getUrl(model: Top20BaseQueryModel): string {
        if (model.topType === TopType.All) {
            return 'NonSportsGamesStatistics/TopTwenty/';
        } else {
            return 'NonSportsGamesStatistics/TopTwentyGroupStatistic/';
        }
    }

    excel(model: Top20BaseQueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }
}
