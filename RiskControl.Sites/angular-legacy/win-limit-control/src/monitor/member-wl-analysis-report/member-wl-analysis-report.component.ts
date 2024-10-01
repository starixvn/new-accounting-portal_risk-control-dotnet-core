import { Component } from '@angular/core';
import { DateHelper, NapDate } from 'nap-components/date';
import { TreeviewConfig } from 'ngx-treeview';
import { DownLoadFileModel, Product } from './member-wl-analysis-report.model';
import { MemberWlAnalysisReportService } from './member-wl-analysis-report.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageType, ToastService } from 'nap-components/toast';
import { Helper } from 'nap-components/helper';

@Component({
  selector: 'nap-member-wl-analysis-report',
  templateUrl: './member-wl-analysis-report.component.html',
  styleUrls: ['./member-wl-analysis-report.component.scss']
})
export class MemberWlAnalysisReportComponent {
  userName: string = '';
  fromDate: NapDate;
  toDate: NapDate;
  minDate: NapDate;
  maxDate: NapDate;
  products: Product[] = [];
  productTreeviewConfig = TreeviewConfig.create({
      hasFilter: true,
      hasAllCheckBox: true,
      hasCollapseExpand: false,
      maxHeight: 500
    });
  selectedProducts: number[] = [];

  constructor(private readonly memberWlAnalysisReportService: MemberWlAnalysisReportService,
    public readonly activeModal: NgbActiveModal,
    private readonly toastService: ToastService
  ) { 
    const lastYear = new Date();
    lastYear.setFullYear(2013, 0, 1);
    this.fromDate = NapDate.fromToday();
    this.toDate = NapDate.fromToday();
    this.minDate = NapDate.fromDate(lastYear);
    this.maxDate = NapDate.fromToday();
    this.memberWlAnalysisReportService.getProducts().subscribe(products => this.products = products);
  }

  onProductSelectedChange(products: number[]): void {
    this.selectedProducts = products;
  }

  generate(): void {
    if (this.isValid()) {
      const model: DownLoadFileModel = {
        productIdList : this.selectedProducts.join(','),
        usernameList: this.userName.trim(),
        fromDate: DateHelper.convertDateStructToString(this.fromDate),
        toDate: DateHelper.convertDateStructToString(this.toDate)
      };
      this.memberWlAnalysisReportService.downloadFile(model).subscribe(response => {
        var contentDisposition = response.headers.get('content-disposition');
        var invalidUsernames = response.headers.get('X-InvalidUsernames');
        if (invalidUsernames?.length > 0 ) {
          this.toastService.activate(`Invalid member(s): ${invalidUsernames}`, MessageType.Warning);
        }
        var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
        Helper.downloadFile(response.body, `${filename}`);
      });
    }
  }

  private isValid(): boolean {
    if (this.selectedProducts.length <= 0) {
      this.toastService.activate('Product is required!', MessageType.Warning);
        return false;
    }
    if (this.selectedProducts.length > 20) {
      this.toastService.activate('Maximum is 20 products!', MessageType.Warning);
        return false;
    }
    if (this.userName.length <= 0) {
      this.toastService.activate('Username is required!', MessageType.Warning);
        return false;
    }
    const maxDate = DateHelper.convertDateStructToMoment(this.fromDate).add(6, 'month');
    if (!DateHelper.convertDateStructToMoment(this.toDate).isBefore(maxDate)) {
        this.toastService.activate('Maximum time range is 6 months.', MessageType.Warning);
        return false;
    }
    return true;
  }

}
