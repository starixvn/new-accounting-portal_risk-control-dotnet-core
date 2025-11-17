import { Component } from '@angular/core';
import { DateHelper, NapDate } from 'nap-components/date';
import { TreeviewConfig } from 'ngx-treeview';
import { DownLoadFileModel, Product } from './member-wl-analysis-report.model';
import { MemberWlAnalysisReportService } from './member-wl-analysis-report.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Helper } from 'nap-components/helper';
import { SharedDataService } from '../../common/services/shared-data.service';
import { SpinnerService } from 'nap-components/spinner';

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
  limitedCount: number = 1440;
  warningMessage: string = undefined;

  constructor(private readonly memberWlAnalysisReportService: MemberWlAnalysisReportService,
    public readonly activeModal: NgbActiveModal,
    private readonly sharedDataService: SharedDataService,
    private readonly spinnerService: SpinnerService
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
    this.warningMessage = undefined;
    if (this.isValid()) {
      const criteria: DownLoadFileModel = {
        productIdList : this.selectedProducts.join(','),
        usernameList: this.userName.trim(),
        fromDate: DateHelper.convertDateStructToString(this.fromDate),
        toDate: DateHelper.convertDateStructToString(this.toDate)
      };
      this.spinnerService.show();
      this.memberWlAnalysisReportService.getGuidFile(criteria).subscribe(model => {
          if (model.guid.length > 0) {
            let timerCount = 0;
            this.intervalId = window.setInterval(() => {
              if (timerCount < this.limitedCount) {
                this.memberWlAnalysisReportService.getFile(model.guid).subscribe(result => {
                  if (result.fileName !== null && result.fileName !== '') {
                    window.clearInterval(this.intervalId);
                    if (result.fileName.includes("NoData")) {
                      if (result.invalidUsernames != null && result.invalidUsernames.length > 0) {
                        if (result.invalidUsernames.trim().split(',').length === this.userName.trim().split(',').length) {
                          this.warningMessage = `Invalid member(s): ${result.invalidUsernames}`;
                        } else {
                          this.warningMessage = `There is no data ! <br/> Invalid member(s): ${result.invalidUsernames}`;
                        }
                      } else {
                        this.warningMessage = 'There is no data !';
                      }
                      this.spinnerService.hide();
                    } else {
                      this.memberWlAnalysisReportService.downloadFile(result.fileName).subscribe(response => {
                        if (response.type.toString() === 'text/plain') {
                          this.warningMessage = 'File not found!';
                        } else {
                          if (result.invalidUsernames != null && result.invalidUsernames.length > 0) {
                          this.warningMessage = `Invalid member(s): ${result.invalidUsernames}`;
                          }
                          var fileNameInfo = result.fileName.split('/');
                          Helper.downloadFile(response, fileNameInfo[fileNameInfo.length-1]);
                          
                        }
                        this.spinnerService.hide();
                      });
                    }
                  } else {
                    timerCount += 1;
                  }                 
                })
              } else {
                window.clearInterval(this.intervalId);
                this.warningMessage = 'The operation timed out. Please try again later.';
                this.spinnerService.hide();
              }
            }, 5000)
          }
      })
      
    }
  }

  closePopup() {
    this.sharedDataService.setPopupData(false);
    this.activeModal.dismiss('Cross click');
  }

  closeWarning() {
    this.warningMessage = undefined
  }

  private isValid(): boolean {
    if (this.selectedProducts.length <= 0) {
      this.warningMessage = 'Product is required!';
        return false;
    }
    if (this.userName.length <= 0) {
      this.warningMessage = 'Username is required!';
        return false;
    }
    const maxDate = DateHelper.convertDateStructToMoment(this.fromDate).add(6, 'month');
    if (!DateHelper.convertDateStructToMoment(this.toDate).isBefore(maxDate)) {
        this.warningMessage = 'Maximum time range is 6 months.';
        return false;
    }
    return true;
  }

}
