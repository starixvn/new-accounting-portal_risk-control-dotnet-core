import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const router = this.injector.get(Router);
        const authenticationService = this.injector.get(AuthenticationService);
        const loginTicket = authenticationService.loginTicket;
        if (loginTicket) {
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + loginTicket.token) });
        }

        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        return next.handle(req)
            .do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('Response intercepted');
                }
            }).catch((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log(`Backend returned code ${err.status}, body was: `);
                    console.log(err.error);

                    if (err.status === 401) {
                        console.log('Status (' + err.status + ') => ' + err.error.reason + ': ' + err.error.body);
                        router.navigate(['/login']);
                    }
                }
                return Observable.throw(err);
            });
    }
}
