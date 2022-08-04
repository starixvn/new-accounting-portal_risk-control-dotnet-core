import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'nap-components/http';
import { MonitorModel } from '../grid';
import { AccountModel } from './account.model';
import { AccountComponent } from './account.component';

@Injectable()
export class AccountService {
    constructor(
        private httpService: HttpService,
        private modalService: NgbModal
    ) { }

    show(monitorModel: MonitorModel) {
        this.query(monitorModel.custId).subscribe(accountModel => {
            const modalRef = this.modalService.open(AccountComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
            const componentInstance: AccountComponent = modalRef.componentInstance;
            componentInstance.show(accountModel);
        });
    }

    private query(custId: number): Observable<AccountModel> {
        const url = 'api/win-limit-control/monitor/account';
        return this.httpService.post<AccountModel>(url, { CustId: custId });
    }
}
