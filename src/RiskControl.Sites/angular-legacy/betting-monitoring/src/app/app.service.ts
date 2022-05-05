import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'nap-components/http';
import { BettingMonitoringModel } from './app.model';


@Injectable()
export class AppService {
    constructor(
        private httpService: HttpService
    ) { }

    query(): Observable<BettingMonitoringModel> {
        const url = 'api/betting-monitoring/query';
        return this.httpService.post<BettingMonitoringModel>(url);
    }

    update(model: BettingMonitoringModel): Observable<boolean> {
        const url = 'state-api/betting-monitoring/update';
        return this.httpService.post<boolean>(url, model);
    }
}
