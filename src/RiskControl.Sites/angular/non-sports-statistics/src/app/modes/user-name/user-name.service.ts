import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { UserNameQueryModel } from './user-name.model';

@Injectable()
export class UserNameService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    query(model: UserNameQueryModel): Observable<GridOptions> {
        const url = this.getMainUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: UserNameQueryModel): Observable<Blob> {
        const url = this.getMainUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    queryGrandTotal(model: UserNameQueryModel): Observable<GridOptions> {
        const url = this.getGrandTotalUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excelGrandTotal(model: UserNameQueryModel): Observable<Blob> {
        const url = this.getGrandTotalUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getMainUrl(model: UserNameQueryModel): string {

        if (model.reportBy === 'SpecificMember') {
            return 'NonSportsGamesStatistics/SpecificMember/Username/';
        }

        return model.isNormalMode
            ? 'NonSportsGamesStatistics/UserNameViewNormal/'
            : 'NonSportsGamesStatistics/UserNameViewHistory/';
    }

    private getGrandTotalUrl(model: UserNameQueryModel): string {
        return model.isNormalMode
            ? 'NonSportsGamesStatistics/UserNameViewGrandTotalNormal/'
            : 'NonSportsGamesStatistics/UserNameViewGrandTotalHistory/';
    }
}
