import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'nap-components/http';
import { MonitorModel } from '../grid';
import { AccountModule, AccountService, AccountModel } from './index';
import { createMonitorModel } from '../grid/grid.model.spec';

describe('AccountService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AccountModule
            ]
        });
    });

    it('should show modal', inject([NgbModal, HttpService, AccountService],
        (modalService: NgbModal, httpService: HttpService, accountService: AccountService) => {
            const monitorModel: MonitorModel = createMonitorModel(1, false);
            const accountModel: AccountModel = {
                Customer: {
                    CustId: 0,
                    Username: '',
                    Agent: '',
                    AgentId: 0,
                    Master: '',
                    MasterId: 0,
                    Super: '',
                    SuperId: 0,
                    SiteName: '',
                    IsCreditUser: false,
                },
                UsersByDevice: [],
                UsersByIP: []
            };
            const modalServiceSpy = spyOn(modalService, 'open').and.returnValue({
                componentInstance: {
                    show: () => { }
                }
            });
            const httpServiceSpy = spyOn(httpService, 'post').and.returnValue(Observable.of(accountModel));
            const result = accountService.show(monitorModel);
            const args = httpServiceSpy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/monitor/account');
            expect(args[1]).toEqual({
                CustId: 1
            });
            expect(modalServiceSpy.calls.any()).toBeTruthy();
        }));
});
