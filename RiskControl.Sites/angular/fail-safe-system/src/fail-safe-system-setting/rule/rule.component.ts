import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'nap-components/toast';
import { Product } from '../filter/filter.model';
import { TreeviewConfig } from 'ngx-treeview';
import { FilterService } from '../filter/filter.service';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
  ruleTitle: string = '';
  productItems: Product[] = [];
  selectedProducts: number[] = [];
  itemConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });
  ruleMemberLimit: number | undefined;
  gameIncome: number | undefined;
  gamePayout: number | undefined;
  enableLetstalk: boolean = false;
  gameIncomeCheckBox: boolean = false;
  gamePayoutCheckBox: boolean = false;

  constructor(public readonly activeModal: NgbActiveModal,
    private readonly toastService: ToastService,
    private readonly filterService: FilterService) { }

  ngOnInit(): void {
    this.filterService.getProducts().subscribe(products => this.productItems = products);
  }

  closePopup() {
    this.activeModal.dismiss('Cross click');
  }

  save(): void {
    if (this.isValid()) {

    }
  }

  cancel(): void {

  }

  private isValid(): boolean {
    if (this.ruleTitle.length === 0) {
      this.toastService.activate('Rule title is required!');
      return false;
    }
    if (this.selectedProducts.length === 0) {
      this.toastService.activate('Product is required!');
      return false;
    }
    if (this.ruleMemberLimit === undefined) {
      this.toastService.activate('Number of Members reach Rule is required!');
      return false;
    } 
    return true;
  }
}
