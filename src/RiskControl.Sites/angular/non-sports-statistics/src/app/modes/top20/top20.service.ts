import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { Top20QueryModel, TopType } from './top20.model';

@Injectable()
export class Top20Service {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: Top20QueryModel): Observable<GridOptions> {
        const url = this.getUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    private getUrl(model: Top20QueryModel): string {
        if (model.topType === TopType.All) {
            return model.isNormalMode
                ? 'NonSportsGamesStatistics/TopTwentyNormal/'
                : 'NonSportsGamesStatistics/TopTwentyHistory/';
        } else {
            return model.isNormalMode
                ? 'NonSportsGamesStatistics/TopTwentyGroupStatisticNormal/'
                : 'NonSportsGamesStatistics/TopTwentyGroupStatisticHistory/';
        }
    }

    excel(model: Top20QueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }
}
