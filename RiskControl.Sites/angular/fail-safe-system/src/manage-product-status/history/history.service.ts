import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { HistoryCriteria, HistoryModel } from './history.model';
import { Observable } from 'rxjs';
import { CommonConstants } from '../../common/constants';
import { HistoryComponent } from './history.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private readonly httpService: HttpService,
    private readonly modalService: NgbModal
  ) { }

  getData(criteria: HistoryCriteria): Observable<HistoryModel[]> {
    return this.httpService.post(`${CommonConstants.API}manage-product-status/history-data`, criteria);
  }

  show(productName: string, productId: number): void {
    this.getData( {productId: productId}).subscribe(data => {
      const modalRef = this.modalService.open(HistoryComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
      const componentInstance = modalRef.componentInstance;
      componentInstance.data = data;
      componentInstance.productName = productName;
    });
  }
}
