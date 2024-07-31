import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { DateHelper } from 'nap-components/date';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { MonitorModel, UnblockCommand, WinLossAnalysisExcel } from './grid.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SpinnerService } from 'nap-components/spinner';
import { tap } from 'rxjs/operators';

@Injectable()
export class GridService {
    constructor(
        private httpService: HttpService,
        private httpClient: HttpClient,
        private spinnerService: SpinnerService
    ) { }

    query(filterModel: FilterModel): Observable<MonitorModel[]> {
        const url = 'api/win-limit-control/monitor/search';
        const queryModel = {
            fromDate: DateHelper.convertDateStructToString(filterModel.fromDate),
            toDate: DateHelper.convertDateStructToString(filterModel.toDate),
            productId: filterModel.productId,
            levelId: filterModel.levelId.join(','),
            userName: filterModel.userName,
            multiSite: filterModel.multiSite,
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

    unCheckNotification(logID: number, custId: number): Observable<CommandResult> {
        const url = 'state-api/win-limit-control/monitor/uncheck-notification';
        return this.httpService.post<CommandResult>(url, { LogID: logID, CustID: custId });
    }

    exportExcel(model: WinLossAnalysisExcel): Observable<HttpResponse<Blob>> {
        this.spinnerService.show();
        const observable =
         this.httpClient.post('api/win-limit-control/download/excel', model, { observe: 'response', responseType: 'blob' });
        return observable.pipe(tap(() => this.spinnerService.hide()));
    }
}
