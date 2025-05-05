import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { BaseQueryModel } from '../../app.model';

@Injectable()
export class DeviceService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: BaseQueryModel): Observable<GridOptions> {
        const url = this.getUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: BaseQueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getUrl(model: BaseQueryModel): string {
        if (model.isDrillDown) {
            return 'NonSportsGamesStatistics/DailyView/';
        } else {
            return 'NonSportsGamesStatistics/Device/';
        }
    }
}
