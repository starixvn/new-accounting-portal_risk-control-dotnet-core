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
  userByDeviceIsExpanded: boolean;
  userByIPIsExpanded: boolean;
  accountModel: AccountModel;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  show(accountModel: AccountModel) {
    this.accountModel = accountModel;
    this.userByDeviceIsExpanded = true;
    this.userByIPIsExpanded = true;
  }

  toggleUserByDevice() {
    this.userByDeviceIsExpanded = !this.userByDeviceIsExpanded;
  }

  toggleUserByIP() {
    this.userByIPIsExpanded = !this.userByIPIsExpanded;
  }
}
