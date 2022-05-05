import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'nap-components/http';
import { HostPermission } from '../model';

@Injectable()
export class AuthorizationService {
    constructor(
        private httpService: HttpService
    ) { }

    getHostPermission(): Observable<HostPermission> {
        const url = `state-api/win-limit-control/authorization/host-permission`;
        return this.httpService.post<HostPermission>(url);
    }
}
