import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { SportQueryModel } from './sport.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class SportService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: SportQueryModel): Observable<GridOptions> {
        const endPoint = this.getApiEndpoint(model, true);
        return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}${endPoint}`, model);
    }

    excel(model: SportQueryModel): Observable<Blob> {
        const endPoint = this.getApiEndpoint(model, false);
        return this.httpService.download(`${ApiConstants.REPORT}${endPoint}`, model);
    }

    getApiEndpoint(model: SportQueryModel, isData: boolean): string {
        let endPoint = 'sport';
        if (model.isDrillDownSport && !model.isDrillDownLeague) {
            endPoint = `${endPoint}/league`;
        };
        if (model.isDrillDownLeague) {
            endPoint = `${endPoint}/bettype`;
        };
        return isData ? `${endPoint}/data` : `${endPoint}/excel`;
    }
}
