import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './local-storage.service';

const sessionName = 'loginTicket';

@Injectable()
export class AuthenticationService {
    constructor(
        private http: Http,
        private localStorageService: LocalStorageService
    ) { }

    get loginTicket(): LoginTicket | null {
        const sessionString = this.localStorageService.getItem(sessionName);
        if (sessionString) {
            return JSON.parse(sessionString);
        }

        return null;
    }

    get isLoggedIn(): boolean {
        return this.loginTicket !== null;
    }

    logIn(username: string, password: string): Observable<any> {
        const options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
        return this.http.post(
            'api/account/login',
            JSON.stringify({ username: username, password: password }),
            options)
            .map(response => {
                const loginTicket = response.json();
                if (loginTicket && loginTicket.token) {
                    this.localStorageService.setItem(sessionName, JSON.stringify(loginTicket));
                }
            });
    }

    logOut() {
        this.localStorageService.removeItem(sessionName);
    }
}

export class UserMenu {
    id: number;
    displayOrder: number;
    parent: UserMenu;
}

export class LoginTicket {
    token: string;
    username: string;
    menus: UserMenu[];
}
