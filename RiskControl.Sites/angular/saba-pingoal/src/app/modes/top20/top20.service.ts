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
        const url = model.topType === TopType.All ?
            `${ApiConstants.REPORT}top20/data` :
            `${ApiConstants.REPORT}top20/data-with-drilldown`;
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: Top20BaseQueryModel): Observable<Blob> {
        const url = model.topType === TopType.All ?
            `${ApiConstants.REPORT}top20/excel` :
            `${ApiConstants.REPORT}top20/excel-with-drilldown`;
        return this.httpService.download(url, model);
    }
}
