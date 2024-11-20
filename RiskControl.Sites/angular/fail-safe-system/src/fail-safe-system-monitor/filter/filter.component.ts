import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MonitorCriteria, Product, RuleTitle } from './filter.model';
import { TreeviewConfig } from 'ngx-treeview';
import { FilterService } from './filter.service';
import { ToastService } from 'nap-components/toast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateFormat, DateHelper,  NapDateStruct } from 'nap-components/date';
import * as moment from 'moment';
import { CONFIG } from '../../common/config';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() valueChange = new EventEmitter<MonitorCriteria>();
  fromDate: NapDateStruct = DateHelper.convertMomentToDateStruct(CONFIG.date.today);
  toDate: NapDateStruct = DateHelper.convertMomentToDateStruct(CONFIG.date.today);
  minDate: NapDateStruct = { year: 2013, month: 1, day: 1 };
  maxDate: NapDateStruct = DateHelper.convertMomentToDateStruct(CONFIG.date.today);

  ruleTitleItems: RuleTitle[] = [];
  selectedRuleTitles: number[] = [];

  productItems: Product[] = [];
  selectedProducts: number[] = [];

  public itemConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });

  constructor(private readonly filterService: FilterService,
    private readonly toastService: ToastService,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.filterService.getRuleTitles().subscribe(ruleTitles => this.ruleTitleItems = ruleTitles);
    this.filterService.getProducts().subscribe(products => this.productItems = products);
  }

  search(): void {
    if (this.isValid()) {
      const fromDate = DateHelper.convertDateStructToMoment(this.fromDate);
      const toDate = DateHelper.convertDateStructToMoment(this.toDate);
      const criteria: MonitorCriteria = {
        fromDate: DateHelper.formatMomentDate(fromDate, DateFormat.Date),
        toDate: DateHelper.formatMomentDate(toDate, DateFormat.Date),
        productIdList: this.selectedProducts.join(','),
        constantKeyList: this.selectedRuleTitles.join(',')
      };
      this.valueChange.emit(criteria);
    }
  }

  private isValid(): boolean {
    if (this.selectedRuleTitles.length <= 0) {
      this.toastService.activate('Please select at least one Rule title!');
      return false;
    }

    if (this.selectedProducts.length <= 0) {
      this.toastService.activate('Please select at least one Product!');
      return false;
    }

    return true;
  }

}
