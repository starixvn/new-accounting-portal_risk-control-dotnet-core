import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../filter/filter.model';
import { TreeviewConfig } from 'ngx-treeview';
import { AddRuleCriteria, AlertType, EditRuleCriteria } from './rule.model';
import { RuleService } from './rule.service';
import * as _ from 'lodash';
import { SharedDataService } from '../../common/shared-data.service';
import { RuleAction } from '../../common/constants';

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
  constantKey: number = 0;
  alertMessage: string = '';
  alertClass = AlertType.Danger;
  isTest: boolean = false;
  enableAutoDisableProduct: boolean = false;
  originalEditRuleCriteria: AddRuleCriteria | undefined;

  constructor(public readonly activeModal: NgbActiveModal,
    private readonly service: RuleService,
    private readonly sharedDataService: SharedDataService) { }

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
        ruleTitle: this.ruleTitle.trim(),
        productIdList: this.selectedProducts.join(','),
        ruleMemberLimit: this.ruleMemberLimit??0,
        enableLetstalk: this.enableLetstalk,
        criteriaList: this.getCriteriaList(),
        isTest: this.isTest,
        enableAutoDisableProduct: this.enableAutoDisableProduct
      };
      if (this.isEdit) {
        if (_.isEqual(this.originalEditRuleCriteria, criteria)) { 
          this.alertMessage = 'There are no changes to save.';
          this.alertClass = AlertType.Danger;
        } else {
          const editCriteria = _.assign({ constantKey: this.constantKey}, criteria);
          this.service.editRule(editCriteria).subscribe(result => {
            if (result) {
              this.activeModal.close();
              this.sharedDataService.setRuleData(RuleAction.Edit);
            }
          });
        }
      } else {
        this.service.addRule(criteria).subscribe(result => {
          if (result) {
            this.activeModal.close();
            this.sharedDataService.setRuleData(RuleAction.Add);
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
      this.alertMessage = 'Rule title is required!';
      this.alertClass = AlertType.Danger;
      return false;
    }
    if (this.selectedProducts.length === 0) {
      this.alertMessage = 'Product is required!';
      this.alertClass = AlertType.Danger;
      return false;
    }
    if (_.isNil(this.ruleMemberLimit)) {
      this.alertMessage = 'Number of Members reach Rule is required!';
      this.alertClass = AlertType.Danger;
      return false;
    }
    if (this.gameIncomeCheckBox && _.isNil(this.gameIncome)) {
      this.alertMessage = 'Game Income is required!';
      this.alertClass = AlertType.Danger;
      return false;
    }
    if (this.gamePayoutCheckBox && _.isNil(this.gamePayout)) {
      this.alertMessage = 'Game Payout is required!';
      this.alertClass = AlertType.Danger;
      return false;
    }
    if ((!this.gameIncomeCheckBox || (this.gameIncomeCheckBox && _.isNil(this.gameIncome)))
      && (!this.gamePayoutCheckBox || (this.gamePayoutCheckBox && _.isNil(this.gamePayout)))) {
      this.alertMessage = 'Game Income/ Game Payout is required!';
      this.alertClass = AlertType.Danger;
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

  closeAlert() {
    this.alertMessage = '';
}
}
