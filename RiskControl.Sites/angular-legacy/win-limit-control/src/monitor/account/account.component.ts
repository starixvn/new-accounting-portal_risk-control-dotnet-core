import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountModel } from './account.model';

@Component({
  selector: 'nap-account',
  templateUrl: './account.component.html',
  styleUrls: [
    './account.component.scss'
  ]
})
export class AccountComponent {
  isExpanded: boolean;
  userByIPIsExpanded: boolean;
  userByManualIsExpanded: boolean;
  accountModel: AccountModel;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  show(accountModel: AccountModel) {
    this.accountModel = accountModel;
    this.isExpanded = true;
    this.userByIPIsExpanded = true;
    this.userByManualIsExpanded = true;

  }

  toggleUserByDevice() {
    this.isExpanded = !this.isExpanded;
  }

  toggleUserByIP() {
    this.userByIPIsExpanded = !this.userByIPIsExpanded;
  }

  toggleUserByManual() {
    this.userByManualIsExpanded = !this.userByManualIsExpanded;
  }
}
