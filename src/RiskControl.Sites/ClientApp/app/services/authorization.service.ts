import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'nap-components/http';

@Injectable()
export class AuthorizationService {
    constructor(
        private httpService: HttpService
    ) { }

    hasHostPermission(): Observable<boolean> {
        const url = `state-api/win-limit-control/authorization/host-permission`;
        return this.httpService.post<boolean>(url);
    }
}
