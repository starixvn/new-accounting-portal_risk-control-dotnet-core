
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { CommandResult } from '../../common/model';
import { PlayerCurrencySetting } from '../grid';
import { Helper } from '../common';
import { InsertCommand } from './insert.model';

@Injectable()
export class InsertHttpService {
    constructor(
        private httpService: HttpService
    ) { }

    validateForInserting(username: string): Observable<CommandResult> {
        const url = 'api/win-limit-control/player-setting/validate-for-inserting';
        return this.httpService.post<CommandResult>(url, { Username: username });
    }

    searchForInserting(username: string): Observable<PlayerCurrencySetting[]> {
        const url = 'api/win-limit-control/player-setting/search-for-inserting';
        return this.httpService.post<PlayerCurrencySetting[]>(url, { Username: username }).pipe(
            map(playerCurrencySettings => {
                Helper.calculateSettingCountForCurrencyGroup(playerCurrencySettings);
                Helper.resetLimitValue(playerCurrencySettings);
                return playerCurrencySettings;
            }));
    }

    insert(insertCommands: InsertCommand[]): Observable<CommandResult> {
        const url = 'state-api/win-limit-control/player-setting/insert';
        return this.httpService.post<CommandResult>(url, insertCommands);
    }
}
