import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpService } from 'nap-components/http';
import { CommandResult } from '../../common/model';
import { PlayerCurrencySetting } from '../grid';
import { InsertModule, InsertHttpService, InsertCommand } from './index';

describe('InsertHttpService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                InsertModule
            ],
            providers: [
                InsertHttpService
            ]
        });
    });

    it('should invoke validateForInserting method with right parameters and returns data of httpService',
        inject([HttpService, InsertHttpService], (httpService: HttpService, insertHttpService: InsertHttpService) => {
            const fakeResult: CommandResult = {
                errorCode: 0
            };
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(fakeResult));
            const result = insertHttpService.validateForInserting('');
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/player-setting/validate-for-inserting');
            expect(args[1]).toEqual({
                Username: ''
            });
            result.subscribe(model => {
                expect(model).toEqual(fakeResult);
            });
        }));

    it('should invoke searchForInserting method with right parameters and returns data of httpService',
        inject([HttpService, InsertHttpService], (httpService: HttpService, insertHttpService: InsertHttpService) => {
            const fakeResult: PlayerCurrencySetting[] = [];
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(fakeResult));
            const result = insertHttpService.searchForInserting('');
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/player-setting/search-for-inserting');
            expect(args[1]).toEqual({
                Username: ''
            });
            result.subscribe(models => {
                expect(models).toEqual(fakeResult);
            });
        }));

    it('should invoke insert method with right parameters and returns data of httpService',
        inject([HttpService, InsertHttpService], (httpService: HttpService, insertHttpService: InsertHttpService) => {
            const insertCommand: InsertCommand[] = [{
                CustId: 1,
                CurrencyId: 1,
                SiteId: 1,
                ProductId: 1,
                GroupId: 1,
                BlackLimit: -2,
                GreyLimit: -1,
                OrangeLimit: 1,
                YellowLimit: 2,
                RedLimit: 3
            }];
            const fakeResult: CommandResult = {
                errorCode: 0
            };
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(fakeResult));
            const result = insertHttpService.insert(insertCommand);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/player-setting/insert');
            expect(args[1]).toEqual(insertCommand);
            result.subscribe(model => {
                expect(model).toEqual(fakeResult);
            });
        }));
});
