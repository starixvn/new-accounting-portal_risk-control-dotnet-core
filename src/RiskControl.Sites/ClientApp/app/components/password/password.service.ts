import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PasswordService {
    constructor(
        private httpClient: HttpClient
    ) { }

    save(oldPassword: string, newPassword: string): Observable<any> {
        return this.httpClient.post<any>(
            'api/account/password',
            { oldPassword: oldPassword, password: newPassword }
        );
    }
}
