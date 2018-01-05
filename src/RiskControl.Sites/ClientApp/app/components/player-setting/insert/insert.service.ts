import { Injectable, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsertComponent } from './insert.component';

@Injectable()
export class InsertService {
    constructor(
        private modalService: NgbModal
    ) { }

    show(): EventEmitter<string> {
        const modalRef = this.modalService.open(InsertComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
        const componentInstance: InsertComponent = modalRef.componentInstance;
        return componentInstance.newPlayerSetting;
    }
}
