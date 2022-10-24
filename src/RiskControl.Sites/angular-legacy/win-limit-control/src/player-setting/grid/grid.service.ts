
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { Helper } from '../common';
import { PlayerCurrencySetting, DeleteCommand, UpdateCommand } from './grid.model';

@Injectable()
export class GridService {
    constructor(
        private httpService: HttpService
    ) { }

    query(filterModel: FilterModel): Observable<PlayerCurrencySetting[]> {
        const url = 'api/win-limit-control/player-setting/search';
        return this.httpService
            .post<PlayerCurrencySetting[]>(url, filterModel).pipe(
            map(playerCurrencySettings => {
                Helper.calculateSettingCountForCurrencyGroup(playerCurrencySettings);
                return playerCurrencySettings;
            }));
    }

    delete(deleteCommand: DeleteCommand): Observable<CommandResult> {
        const url = 'state-api/win-limit-control/player-setting/delete';
        return this.httpService.post<CommandResult>(url, deleteCommand);
    }

    update(updateCommand: UpdateCommand): Observable<CommandResult> {
        const url = 'state-api/win-limit-control/player-setting/update';
        return this.httpService.post<CommandResult>(url, updateCommand);
    }
}
