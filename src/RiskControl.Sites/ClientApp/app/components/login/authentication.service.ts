import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'nap-components/http';
import { LoginModel, LoginTicket } from './login.model';

const sessionName = 'loginTicket';

@Injectable()
export class AuthenticationService {
    private internalLoginTicket: LoginTicket;

    constructor(
        private httpService: HttpService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (this.isBrowser()) {
            var session = localStorage.getItem(sessionName);
            if (session) {
                this.internalLoginTicket = JSON.parse(session);
            }
        }
    }

    get loginTicket(): LoginTicket {
        return this.internalLoginTicket;
    }

    isLoggedIn(): boolean {
        return this.loginTicket !== undefined;
    }

    logIn(loginModel: LoginModel): Observable<LoginTicket> {
        const url = 'api/account/login';
        return this.httpService.post<LoginTicket>(url, loginModel)
            .map(loginTicket => {
                if (this.isBrowser()) {
                    localStorage.setItem(sessionName, JSON.stringify(loginTicket));
                }
                return loginTicket;
            });
    }

    logOut() {
        // remove user from local storage to log user out
        if (this.isBrowser()) {
            localStorage.removeItem(sessionName);
        }
    }

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
}
