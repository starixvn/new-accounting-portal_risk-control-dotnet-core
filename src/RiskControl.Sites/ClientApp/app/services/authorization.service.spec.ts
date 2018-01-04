import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpService, HttpModule } from 'nap-components/http';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                AuthorizationService
            ]
        });
    });

    it('should invoke hasHostPermission method with right parameters and returns data of httpService',
        inject([HttpService, AuthorizationService], (httpService: HttpService, authorizationService: AuthorizationService) => {
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(true));
            const result = authorizationService.hasHostPermission();
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/authorization/host-permission');
            result.subscribe(model => {
                expect(model).toEqual(true);
            });
        }));
});
