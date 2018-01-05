const CryptoJS = require('../../../js/CryptoJS') as CryptoJSInterface;
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './local-storage.service';

const sessionName = 'loginTicket';
interface CryptoJSInterface {
    CfsEnCode(input: string): string;
}

@Injectable()
export class AuthenticationService {
    constructor(
        private http: HttpClient,
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

    encryptPassword(password: string): string {
        return CryptoJS.CfsEnCode(password.trim());
    }

    logIn(username: string, password: string): Observable<LoginTicket> {
        return this.http.post<LoginTicket>(
            'api/account/login',
            { username: username, password: password })
            .map(loginTicket => {
                if (loginTicket && loginTicket.token) {
                    this.localStorageService.setItem(sessionName, JSON.stringify(loginTicket));
                }

                return loginTicket;
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
