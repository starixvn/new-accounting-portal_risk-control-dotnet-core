import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ModalService } from 'components/modal';
import { UserNameQueryModel } from '../user-name';

@Injectable()
export class AssociatedAccountService {
    private readonly url = 'NonSportsGamesStatistics';

    constructor(
        private readonly httpService: HttpService,
    ) { }

    query(model: UserNameQueryModel): Observable<GridOptions> {
        const url = this.getAssociatedAccountsUrl(model) + 'Query';
        return this.httpService.post<GridOptions>(url, model);
    }

    excel(model: UserNameQueryModel): Observable<Blob> {
        const url = this.getAssociatedAccountsUrl(model) + 'Excel';
        return this.httpService.download(url, model);
    }

    private getAssociatedAccountsUrl(model: UserNameQueryModel) {
        if(model.reportBy === 'SpecificMember') {
            return 'NonSportsGamesStatistics/SpecificMember/AssociatedAccount/';
        }

        return model.isNormalMode
            ? `${this.url}/AssociatedAccountNormal/`
            : `${this.url}/AssociatedAccountHistory/`;
    }
}
