import { Injectable } from '@angular/core';
import { DownLoadFileModel, Product } from './member-wl-analysis-report.model';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberWlAnalysisReportComponent } from './member-wl-analysis-report.component';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SpinnerService } from 'nap-components/spinner';
import { tap } from 'rxjs/operators';
import { SharedDataService } from '../../common/services/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class MemberWlAnalysisReportService {

  constructor(private readonly httpService: HttpService,
    private readonly modalService: NgbModal,
    private readonly httpClient: HttpClient,
    private readonly spinnerService: SpinnerService,
    private readonly sharedDataService: SharedDataService
  ) { }

  getProducts(): Observable<Product[]> {
    const url = 'api/win-limit-control/filter/get-products-member-winloss';
    return this.httpService.post<Product[]>(url);
  }

  showFilter(): void {
    this.sharedDataService.setPopupData(true);
    this.modalService.open(MemberWlAnalysisReportComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
  }

  downloadFile(model: DownLoadFileModel): Observable<HttpResponse<Blob>> {
    this.spinnerService.show();
    const observable =
     this.httpClient.post('api/win-limit-control/download/member-wl-file', model, { observe: 'response', responseType: 'blob' });
    return observable.pipe(tap(() => this.spinnerService.hide()));
  }
}
