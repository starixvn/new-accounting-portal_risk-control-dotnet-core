import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpService } from 'nap-components/http';
import { NapDate } from 'nap-components/date';
import { Columns } from '../common/column';
import { FilterModel } from '../filter';
import { CommandResult } from '../../common/model';
import { GridModule, GridService, MonitorModel, UnblockCommand } from './index';

describe('GridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                GridModule
            ],
            providers: [
                GridService
            ]
        });
    });

    it('should invoke search method with right parameters and returns data of httpService',
        inject([HttpService, GridService], (httpService: HttpService, gridService: GridService) => {
            const monitorModels: MonitorModel[] = [];
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(monitorModels));
            const filterModel: FilterModel = {
                fromDate: new NapDate(2017, 4, 1),
                toDate: new NapDate(2017, 4, 31),
                productId: 0,
                userName: '',
                siteId: 0,
                currencyId: 0,
                levelId: [102, 101, 1, 2, 3],
                excludeTestData: false,
                columns: Columns
            };
            const result = gridService.query(filterModel);
            const args = spy.calls.mostRecent().args;
            const httpQueryModel = {
                fromDate: '2017-04-01T00:00:00',
                toDate: '2017-04-31T00:00:00',
                productId: 0,
                levelId: '102,101,1,2,3',
                userName: '',
                siteId: 0,
                currencyId: 0,
                excludeTestData: false
            };
            expect(args[0]).toBe('api/win-limit-control/monitor/search');
            expect(args[1]).toEqual(httpQueryModel);
            result.subscribe(models => {
                expect(models).toEqual(monitorModels);
            });
        }));

    it('should invoke unblockPlaceBet method with right parameters and returns data of httpService',
        inject([HttpService, GridService], (httpService: HttpService, gridService: GridService) => {
            const commandResult: CommandResult = {
                ErrorCode: 0
            };
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(commandResult));
            const unblockCommand: UnblockCommand = {
                CustId: 0,
                ProductId: 0,
                GroupId: 0
            };
            const result = gridService.unblockPlaceBet(unblockCommand);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/monitor/unblock-place-bet');
            expect(args[1]).toEqual(unblockCommand);
            result.subscribe(model => {
                expect(model).toEqual(commandResult);
            });
        }));

    it('should invoke unblockTransfer method with right parameters and returns data of httpService',
        inject([HttpService, GridService], (httpService: HttpService, gridService: GridService) => {
            const commandResult: CommandResult = {
                ErrorCode: 0
            };
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(commandResult));
            const unblockCommand: UnblockCommand = {
                CustId: 0,
                ProductId: 0,
                GroupId: 0
            };
            const result = gridService.unblockTransfer(unblockCommand);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/monitor/unblock-transfer');
            expect(args[1]).toEqual(unblockCommand);
            result.subscribe(model => {
                expect(model).toEqual(commandResult);
            });
        }));
});
