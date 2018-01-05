import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'nap-components/http';
import { MonitorModel } from '../grid';
import { HistoryModule, HistoryService, HistoryModel } from './index';
import { createMonitorModel } from '../grid/grid.model.spec';

describe('HistoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HistoryModule
            ]
        });
    });

    it('should show modal', inject([NgbModal, HttpService, HistoryService],
        (modalService: NgbModal, httpService: HttpService, historyService: HistoryService) => {
            const monitorModel: MonitorModel = createMonitorModel(1, false);
            const historyModels: HistoryModel[] = [];
            const modalServiceSpy = spyOn(modalService, 'open').and.returnValue({
                componentInstance: {
                    show: () => { }
                }
            });
            const httpServiceSpy = spyOn(httpService, 'post').and.returnValue(Observable.of(historyModels));
            const result = historyService.show(monitorModel);
            const args = httpServiceSpy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/monitor/history');
            expect(args[1]).toEqual({
                CustId: 1,
                ProductId: 1
            });
            expect(modalServiceSpy.calls.any()).toBeTruthy();
        }));
});
