import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpService } from 'nap-components/http';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { PlayerCurrencySetting, DeleteCommand, UpdateCommand, GridService, GridModule } from './index';

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

    const commandResult: CommandResult = {
        errorCode: 0
    };

    it('should invoke search method with right parameters and returns data of httpService',
        inject([HttpService, GridService], (httpService: HttpService, gridService: GridService) => {
            const playerCurrencySettings: PlayerCurrencySetting[] = [];
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(playerCurrencySettings));
            const filterModel: FilterModel = {
                productId: 0,
                userName: '',
                siteId: 0,
                currencyId: 0
            };
            const result = gridService.query(filterModel);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/player-setting/search');
            expect(args[1]).toEqual(filterModel);
            result.subscribe(models => {
                expect(models).toEqual(playerCurrencySettings);
            });
        }));

    it('should invoke update method with right parameters and returns data of httpService', inject([HttpService, GridService],
        (httpService: HttpService, gridService: GridService) => {
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(commandResult));
            const updateCommand: UpdateCommand = {
                CustId: 1,
                ProductId: 1,
                GroupId: 1,
                LevelId: 1,
                Limit: 1
            };
            const result = gridService.update(updateCommand);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/player-setting/update');
            expect(args[1]).toEqual(updateCommand);
            result.subscribe(model => {
                expect(model).toEqual(commandResult);
            });
        }));

    it('should invoke delete method with right parameters and returns data of httpService',
        inject([HttpService, GridService], (httpService: HttpService, gridService: GridService) => {
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(commandResult));
            const deleteCommand: DeleteCommand = {
                CustId: 1,
                ProductId: 1,
                GroupId: 1
            };
            const result = gridService.delete(deleteCommand);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/player-setting/delete');
            expect(args[1]).toEqual(deleteCommand);
            result.subscribe(model => {
                expect(model).toEqual(commandResult);
            });
        }));
});
