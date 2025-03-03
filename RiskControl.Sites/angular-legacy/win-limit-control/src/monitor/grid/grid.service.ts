import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { DateHelper } from 'nap-components/date';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { ApiResultModel, MonitorModel, QueryModel, UnblockCommand, WinLossAnalysisExcel } from './grid.model';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { Helper } from 'nap-components/helper';

@Injectable()
export class GridService {
    constructor(
        private httpService: HttpService
    ) { }

    query(filterModel: FilterModel): Observable<MonitorModel[]> {
        const url = 'api/win-limit-control/monitor/search';
        const queryModel = this.createQueryModel(filterModel);
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

    getGuidFile(model: WinLossAnalysisExcel): Observable<ApiResultModel> {
        return this.httpService.post<ApiResultModel>('api/win-limit-control/download/guid', model, { noSpinner: true});
    }
    
    getFile(guid: string): Observable<ApiResultModel> {
        return this.httpService.get<ApiResultModel>(`api/win-limit-control/download/file?guid=${guid}`, {}, { noSpinner: true});
    }
    
    downloadFile(fileName: string): Observable<HttpResponse<Blob>> {
        return this.httpService.get(`api/win-limit-control/download/excel?fileName=${fileName}`, { noSpinner: true, responseType: 'blob' });
    }

    exportExcelMain(filterModel: FilterModel): void {
        const fromDate = moment(DateHelper.convertDateStructToMoment(filterModel.fromDate)).format('MMM_DD_YYYY');
        const toDate = moment(DateHelper.convertDateStructToMoment(filterModel.toDate)).format('MMM_DD_YYYY');
        const queryModel = this.createQueryModel(filterModel);
        this.httpService.download(`api/win-limit-control/monitor/excel`, queryModel).subscribe(response => {
          const fileName = `CWL_Alert_From_${fromDate}_To_${toDate}.xlsx`;
          Helper.downloadFile(response, fileName);
        });
    }

    private createQueryModel(filterModel: FilterModel): QueryModel {
        return {
            fromDate: DateHelper.convertDateStructToString(filterModel.fromDate),
            toDate: DateHelper.convertDateStructToString(filterModel.toDate),
            productId: filterModel.productId,
            levelId: filterModel.levelId.join(','),
            userName: filterModel.userName,
            multiSite: filterModel.multiSite,
            currencyId: filterModel.currencyId,
            excludeTestData: filterModel.excludeTestData
        };
    }
}
