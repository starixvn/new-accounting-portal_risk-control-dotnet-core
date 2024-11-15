import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageType, ToastService } from 'nap-components/toast';
import { Product } from '../filter/filter.model';
import { TreeviewConfig } from 'ngx-treeview';
import { AddRuleCriteria } from './rule.model';
import { RuleService } from './rule.service';
import * as _ from 'lodash';

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
  isEdit: boolean = false;
  ruleId: number = 0;

  constructor(public readonly activeModal: NgbActiveModal,
    private readonly toastService: ToastService,
    private readonly service: RuleService) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.activeModal.dismiss('Cross click');
  }

  get title(): string {
    return this.isEdit ? 'EDIT NEW RULE' : 'ADD NEW RULE';
  }

  save(): void {
    if (this.isValid()) {
      const criteria: AddRuleCriteria = {
        ruleTitle: this.ruleTitle,
        productIdList: this.selectedProducts.join(','),
        ruleMemberLimit: this.ruleMemberLimit??0,
        enableLetstalk: this.enableLetstalk,
        criteriaList: this.getCriteriaList()
      }
      if (this.isEdit) {
        const editCriteria = _.assign({ ruleId: this.ruleId}, criteria);
        this.service.editRule(editCriteria).subscribe(result => {
          if (result) {
            this.toastService.activate('Rule has been edited successfully!', MessageType.Success);
          }
        });
      } else {
        this.service.addRule(criteria).subscribe(result => {
          if (result) {
            this.toastService.activate('Rule has been added successfully!', MessageType.Success);
          }
        });
      }
    }
  }

  cancel(): void {
    this.activeModal.dismiss('Cross click');
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
    if (_.isNil(this.ruleMemberLimit)) {
      this.toastService.activate('Number of Members reach Rule is required!');
      return false;
    }
    if ((this.gameIncomeCheckBox && _.isNil(this.gameIncome))
      || (this.gamePayoutCheckBox && _.isNil(this.gamePayout))) {
      this.toastService.activate('Game Income/ Game Payout is required!');
      return false;
    }
    return true;
  }

  private getCriteriaList(): string {
    let result: string[] = [];
    if (this.gameIncomeCheckBox) {
      result.push(`1_${this.gameIncome}`);
    }
    if (this.gamePayoutCheckBox) {
      result.push(`2_${this.gamePayout}`);
    }
    return result.join(',');
  }
}
