import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ModalService } from 'components/modal';
import { UserNameBaseQueryModel } from '../user-name';

@Injectable()
export class AssociatedAccountService {
    private readonly url = 'NonSportsGamesStatistics/AssociatedAccount';

    constructor(
        private readonly httpService: HttpService,
    ) { }

    query(model: UserNameBaseQueryModel): Observable<GridOptions> {
        return this.httpService.post<GridOptions>(`${this.url}/Query`, model);
    }

    excel(model: UserNameBaseQueryModel): Observable<Blob> {
        return this.httpService.download(`${this.url}/Excel`, model);
    }
}
