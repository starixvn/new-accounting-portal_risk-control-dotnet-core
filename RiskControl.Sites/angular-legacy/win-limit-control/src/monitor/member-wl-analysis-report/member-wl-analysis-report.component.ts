import { Component } from '@angular/core';
import { DateHelper, NapDate } from 'nap-components/date';
import { TreeviewConfig } from 'ngx-treeview';
import { DownLoadFileModel, Product } from './member-wl-analysis-report.model';
import { MemberWlAnalysisReportService } from './member-wl-analysis-report.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageType, ToastService } from 'nap-components/toast';
import { Helper } from 'nap-components/helper';
import { SharedDataService } from '../../common/services/shared-data.service';

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
  intervalId: number = 0;
  limitedCount: number = 10;

  constructor(private readonly memberWlAnalysisReportService: MemberWlAnalysisReportService,
    public readonly activeModal: NgbActiveModal,
    private readonly toastService: ToastService,
    private readonly sharedDataService: SharedDataService
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
      const criteria: DownLoadFileModel = {
        productIdList : this.selectedProducts.join(','),
        usernameList: this.userName.trim(),
        fromDate: DateHelper.convertDateStructToString(this.fromDate),
        toDate: DateHelper.convertDateStructToString(this.toDate)
      };
      this.memberWlAnalysisReportService.getGuidFile(criteria).subscribe(model => {
          if (model.guid.length > 0) {
            let timerCount = 0;
            this.intervalId = window.setInterval(() => {
              if (timerCount < this.limitedCount) {
                this.memberWlAnalysisReportService.getFile(model.guid).subscribe(result => {
                  if (result?.fileName.length > 0) {
                    window.clearInterval(this.intervalId);
                    this.memberWlAnalysisReportService.downloadFile(result).subscribe(response => {
                      if (result?.invalidUsernames.length > 0) {
                        this.toastService.activate(`Invalid member(s): ${result.invalidUsernames}`, MessageType.Warning);
                      }
                      Helper.downloadFile(response.body, result.fileName);
                    })
                  } else {
                    timerCount += 1;
                  }                 
                })
              } else {
                window.clearInterval(this.intervalId);
                this.toastService.activate('Timeout !!!', MessageType.Warning);
              }
            })
          }
      })
      
    }
  }

  closePopup() {
    this.sharedDataService.setPopupData(false);
    this.activeModal.dismiss('Cross click');
  }

  private isValid(): boolean {
    if (this.selectedProducts.length <= 0) {
      this.toastService.activate('Product is required!', MessageType.Warning);
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
