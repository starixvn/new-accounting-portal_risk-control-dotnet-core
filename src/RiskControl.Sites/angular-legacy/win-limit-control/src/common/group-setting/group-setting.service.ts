import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'nap-components/http';
import { GroupSettingComponent } from './group-setting.component';
import { ProductBetTypeSetting } from './group-setting.model';

@Injectable()
export class GroupSettingService {
    private productBetTypeSettings: ProductBetTypeSetting[];

    constructor(
        private modalService: NgbModal,
        private httpService: HttpService
    ) { }

    show(productName: string) {
        if (!this.productBetTypeSettings) {
            this.queryProductBetTypeSettings().subscribe(productBetTypeSettings => {
                this.productBetTypeSettings = productBetTypeSettings;
                this.internalShow(productName);
            });
        } else {
            this.internalShow(productName);
        }
    }

    private internalShow(productName: string) {
        const modalRef = this.modalService.open(GroupSettingComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
        const componentInstance: GroupSettingComponent = modalRef.componentInstance;
        componentInstance.updateSettings(this.productBetTypeSettings, productName);
    }

    private queryProductBetTypeSettings(): Observable<ProductBetTypeSetting[]> {
        const url = 'api/win-limit-control/group-settings';
        return this.httpService.post<ProductBetTypeSetting[]>(url, { cache: true });
    }
}
