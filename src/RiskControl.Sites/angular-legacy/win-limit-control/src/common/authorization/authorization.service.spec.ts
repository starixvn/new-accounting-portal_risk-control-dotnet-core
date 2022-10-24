import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpService, HttpModule } from 'nap-components/http';
import { AuthorizationService } from './index';
import { HostPermission } from '../model';

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
            const hostPermission: HostPermission = {
                playerWinLimitManagement: true,
                currencyWinLimitSetting: true,
                winLimitMonitor: true
            }
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(hostPermission));
            const result = authorizationService.getHostPermission();
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/authorization/host-permission');
            result.subscribe(model => {
                expect(model).toEqual(hostPermission);
            });
        }));
});
