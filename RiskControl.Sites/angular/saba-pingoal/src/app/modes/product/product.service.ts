import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ProductQueryModel } from './product.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class ProductService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: ProductQueryModel): Observable<GridOptions> {
        const api = model.isDrillDownSport
            ? `${ApiConstants.REPORT}product/league/data` : `${ApiConstants.REPORT}product/data`;
        return this.httpService.post<GridOptions>(api, model);
    }

    excel(model: ProductQueryModel): Observable<Blob> {
        const api = model.isDrillDownSport
            ? `${ApiConstants.REPORT}product/league/excel` : `${ApiConstants.REPORT}product/excel`;
        return this.httpService.download(api, model);
    }
}
