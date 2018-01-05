import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'nap-components/http';
import { DateHelper } from 'nap-components/date';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { MonitorModel, UnblockCommand } from './grid.model';

@Injectable()
export class GridService {
    constructor(
        private httpService: HttpService
    ) { }

    query(filterModel: FilterModel): Observable<MonitorModel[]> {
        const url = 'api/win-limit-control/monitor/search';
        const queryModel = {
            fromDate: DateHelper.convertDateStructToString(filterModel.fromDate),
            toDate: DateHelper.convertDateStructToString(filterModel.toDate),
            productId: filterModel.productId,
            levelId: filterModel.levelId.join(','),
            userName: filterModel.userName,
            siteId: filterModel.siteId,
            currencyId: filterModel.currencyId,
            excludeTestData: filterModel.excludeTestData
        };
        return this.httpService.post<MonitorModel[]>(url, queryModel);
    }

    unblockPlaceBet(unblockCommand: UnblockCommand): Observable<CommandResult> {
        const url = 'state-api/win-limit-control/monitor/unblock-place-bet';
        return this.httpService.post<CommandResult>(url, unblockCommand);
    }

    unblockTransfer(unblockCommand: UnblockCommand): Observable<CommandResult> {
        const url = 'state-api/win-limit-control/monitor/unblock-transfer';
        return this.httpService.post<CommandResult>(url, unblockCommand);
    }
}
