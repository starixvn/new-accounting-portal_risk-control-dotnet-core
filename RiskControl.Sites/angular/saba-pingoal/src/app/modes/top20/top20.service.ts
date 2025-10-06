import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { Top20BaseQueryModel, TopType } from './top20.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class Top20Service {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: Top20BaseQueryModel): Observable<GridOptions> {
        const url = this.getUrl(model) + 'data';
        return this.httpService.post<GridOptions>(url, model);
    }

    private getUrl(model: Top20BaseQueryModel): string {
        if (model.topType === TopType.All) {
            return `${ApiConstants.REPORT}top20/`;
        } else {
            return `${ApiConstants.REPORT}top20/statistics/`
        }
    }

    excel(model: Top20BaseQueryModel): Observable<Blob> {
        const url = this.getUrl(model) + 'excel';
        return this.httpService.download(url, model);
    }
}
