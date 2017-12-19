import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PasswordService {
    constructor(
        private http: Http
    ) { }

    save(oldPassword: string, newPassword: string, token: string): Observable<any> {
        const authHeader = `Bearer ${token}`;
        return this.http.post(
            'api/account/password',
            { oldPassword: oldPassword, password: newPassword },
            {
                headers: new Headers({ Authorization: authHeader })
            }
        );
    }
}
