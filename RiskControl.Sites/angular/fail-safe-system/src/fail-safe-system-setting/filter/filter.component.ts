import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product, RuleTitle, SettingCriteria } from './filter.model';
import { FilterService } from './filter.service';
import { TreeviewConfig } from 'ngx-treeview';
import { ToastService } from 'nap-components/toast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RuleComponent } from '../rule/rule.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() valueChange = new EventEmitter<SettingCriteria>();
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
      const criteria: SettingCriteria = {
        productIdList: this.selectedProducts.join(','),
        ruleIdList: this.selectedRuleTitles.join(',')
      };
      this.valueChange.emit(criteria);
    }
  }

  addNewRule(): void {
    this.filterService.getProducts().subscribe(products => {
      var modalRef = this.modalService.open(RuleComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
      var component = modalRef.componentInstance as RuleComponent;
      component.productItems = products;
      component.isEdit = false;
    });
    
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
