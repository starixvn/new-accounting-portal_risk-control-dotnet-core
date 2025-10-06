import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { UserNameBaseQueryModel } from './user-name.model';

@Injectable()
export class UserNameService {
    private readonly mainUrl = 'NonSportsGamesStatistics/UserNameView';
    private readonly grandTotalUrl = 'NonSportsGamesStatistics/UserNameViewGrandTotal';
    
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: UserNameBaseQueryModel): Observable<GridOptions> {
        const url = `${this.mainUrl}/Query`;
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: UserNameBaseQueryModel): Observable<Blob> {
        const url = `${this.mainUrl}/Excel`;
        return this.httpService.download(url, model);
    }

    queryGrandTotal(model: UserNameBaseQueryModel): Observable<GridOptions> {
        const url = `${this.grandTotalUrl}/Query`;
        return this.httpService.post<GridOptions>(url, model);
    }

    excelGrandTotal(model: UserNameBaseQueryModel): Observable<Blob> {
        const url = `${this.grandTotalUrl}/Excel`;
        return this.httpService.download(url, model);
    }
}
