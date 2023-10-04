import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { QueryModel } from '../../app.model';

@Injectable()
export class DeviceService {
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
        if (model.isDrillDown) {
            return model.isNormalMode
                ? 'NonSportsGamesStatistics/DailyViewNormal/'
                : 'NonSportsGamesStatistics/DailyViewHistory/';
        } else {
            return model.isNormalMode
                ? 'NonSportsGamesStatistics/DeviceNormal/'
                : 'NonSportsGamesStatistics/DeviceHistory/';
        }
    }
}
