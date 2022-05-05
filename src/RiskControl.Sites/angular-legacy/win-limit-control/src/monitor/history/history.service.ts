import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'nap-components/http';
import { MonitorModel } from '../grid';
import { HistoryModel } from './history.model';
import { HistoryComponent } from './history.component';
import { CommandResult } from '../../common/model';

@Injectable()
export class HistoryService {
    constructor(
        private httpService: HttpService,
        private modalService: NgbModal
    ) { }

    show(monitorModel: MonitorModel, hasHostPermission: boolean) {
        this.query(monitorModel.CustId, monitorModel.ProductId).subscribe(historyModels => {
            const modalRef = this.modalService.open(HistoryComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
            const componentInstance: HistoryComponent = modalRef.componentInstance;
            componentInstance.show(historyModels, monitorModel.UserName, monitorModel.ProductName, monitorModel.CustId, hasHostPermission);
        });
    }

    private query(custId: number, productId: number): Observable<HistoryModel[]> {
        const url = 'api/win-limit-control/monitor/history';
        return this.httpService.post<HistoryModel[]>(url, { CustId: custId, ProductId: productId });
    }
}
