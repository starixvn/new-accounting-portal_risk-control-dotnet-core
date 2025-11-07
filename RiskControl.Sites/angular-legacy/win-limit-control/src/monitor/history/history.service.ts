import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'nap-components/http';
import { MonitorModel } from '../grid';
import { HistoryModel } from './history.model';
import { HistoryComponent } from './history.component';
import { CommandResult } from '../../common/model';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class HistoryService {
    constructor(
        private httpService: HttpService,
        private modalService: NgbModal
    ) { }

    show(monitorModel: MonitorModel, hasHostPermission: boolean) {
        this.query(monitorModel.custId, monitorModel.productId).subscribe(historyModels => {
            const modalRef = this.modalService.open(HistoryComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
            const componentInstance: HistoryComponent = modalRef.componentInstance;
            componentInstance.show(historyModels, monitorModel.userName, monitorModel.productName, monitorModel.custId, hasHostPermission);
        });
    }

    downloadFile(fileName: string): Observable<HttpResponse<Blob>> {
            return this.httpService.get(`api/win-limit-control/download/excel-web?fileName=${fileName}`, { noSpinner: true, responseType: 'blob' });
    }

    private query(custId: number, productId: number): Observable<HistoryModel[]> {
        const url = 'api/win-limit-control/monitor/history';
        return this.httpService.post<HistoryModel[]>(url, { CustId: custId, ProductId: productId });
    }
}
