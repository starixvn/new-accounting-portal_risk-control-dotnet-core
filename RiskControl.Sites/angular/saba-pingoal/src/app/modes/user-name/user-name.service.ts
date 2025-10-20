import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { UserNameBaseQueryModel } from './user-name.model';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class UserNameService {    
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: UserNameBaseQueryModel): Observable<GridOptions> {
        const url = `${ApiConstants.REPORT}username/data`;
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: UserNameBaseQueryModel): Observable<Blob> {
        const url = `${ApiConstants.REPORT}username/excel`;
        return this.httpService.download(url, model);
    }
}
