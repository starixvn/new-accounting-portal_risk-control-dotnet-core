import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { RoleId } from '../../common';

@Injectable()
export class UserNameSuggestionService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    getUsernameSuggestion(term: string, roleId: RoleId): Observable<string[]> {
        const url = 'state-api/NonSportsGamesStatistics/Filter/UserName/Suggest';
        const queryModel = {
            userName: term,
            roleId: roleId
        };

        return this.httpService.post<string[]>(url, queryModel, {
            noToast: true,
            noSpinner: true
        });
    }
}
