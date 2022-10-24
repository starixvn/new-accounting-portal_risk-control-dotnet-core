import { Component, EventEmitter, OnInit, ViewChildren, QueryList } from '@angular/core';
import * as _ from 'lodash';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, MessageType } from 'nap-components/toast';
import { ConfirmationService } from 'nap-components/confirmation';
import { TypeaheadQuery } from 'nap-components/dropdown-typeahead';
import { FilterService } from '../../common/filter';
import { LossLimitValidatorDirective } from '../../common/loss-limit-textbox';
import { WinLimitValidatorDirective } from '../../common/win-limit-textbox';
import { PlayerCurrencySetting, PlayerSetting } from '../grid';
import { InsertCommand } from './insert.model';
import { InsertHttpService } from './insert-http.service';

@Component({
  selector: 'nap-insert',
  templateUrl: './insert.component.html',
  styleUrls: [
    './insert.component.scss'
  ],
  providers: [
    InsertHttpService,
    FilterService
  ]
})
export class InsertComponent implements OnInit {
  @ViewChildren(LossLimitValidatorDirective) lossLimitValidatorDirectives: QueryList<LossLimitValidatorDirective>;
  @ViewChildren(WinLimitValidatorDirective) winLimitValidatorDirectives: QueryList<WinLimitValidatorDirective>;
  newPlayerSetting = new EventEmitter<string>();
  userNameTypeaheadQuery: TypeaheadQuery;
  playerCurrencySettings: PlayerCurrencySetting[];
  username: string;
  error: string;

  constructor(
    public activeModal: NgbActiveModal,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private filterService: FilterService,
    private insertHttpService: InsertHttpService
  ) { }

  ngOnInit() {
    this.userNameTypeaheadQuery = this.filterService.createUserNameTypeaheadQuery();
  }

  search() {
    this.error = undefined;

    if (this.username === undefined || this.username.length === 0) {
      this.error = 'Required field.';
      return;
    }

    this.insertHttpService.validateForInserting(this.username).subscribe(commandResult => {
      switch (commandResult.errorCode) {
        case 3:
          this.error = 'Invalid username';
          break;
        case 4:
          this.error = 'There is no product setting for this player. Please check the Currency Win Loss Limit setting.';
          break;
        case 0:
          this.insertHttpService.searchForInserting(this.username).subscribe(model => {
            if (model.length === 0) {
              this.error = 'There is no more products to set Player Win Loss Limit.';
              return;
            }

            this.playerCurrencySettings = model;
          });
          break;
      }
    });
  }

  save() {
    this.error = undefined;
    const lossLimitValidatorDirectives = this.lossLimitValidatorDirectives.toArray();
    for (const directive of lossLimitValidatorDirectives) {
      if (!directive.isValid) {
        directive.focusInvalid();
        return;
      }
    }

    const winLimitValidatorDirectives = this.winLimitValidatorDirectives.toArray();
    for (const directive of winLimitValidatorDirectives) {
      if (!directive.isValid) {
        directive.focusInvalid();
        return;
      }
    }

    const insertCommands: InsertCommand[] = this.getInsertCommands(this.playerCurrencySettings);
    if (insertCommands.length === 0) {
      this.error = 'There is no change to insert';
      return;
    }

    this.confirmationService.openContent(
      `Are you sure want to set Player Win Loss Limit of ${this.username}?`,
      () => {
        this.internalSave(insertCommands);
      }
    );
  }

  private internalSave(insertCommands: InsertCommand[]) {
    this.insertHttpService.insert(insertCommands).subscribe(commandResult => {
      switch (commandResult.errorCode) {
        case 1:
          // tslint:disable-next-line:max-line-length
          this.error = 'Please input Black level limit < Grey level limit <= 0 <= Orange level limit < Yellow level limit < Red level limit.';
          break;
        case 2:
          this.error = 'The currency win limit was not set.';
          break;
        case 0:
          this.toastService.activate('The Player Win Loss Limit(s) has been added successfully!', MessageType.Success);
          this.activeModal.close();
          this.newPlayerSetting.emit('new player setting has been inserted');
          break;
      }
    });
  }

  private getInsertCommands(playerCurrencySettings: PlayerCurrencySetting[]): InsertCommand[] {
    const insertCommands: InsertCommand[] = [];
    for (const currencySetting of playerCurrencySettings) {
      for (const productSetting of currencySetting.products) {
        for (const playerSetting of productSetting.playerSettings) {
          if (this.isSettingModified(playerSetting)) {
            const insertCommand: InsertCommand = {
              custId: playerSetting.custId,
              currencyId: playerSetting.currencyId,
              siteId: playerSetting.siteId,
              productId: playerSetting.productId,
              groupId: playerSetting.groupId,
              blackLimit: playerSetting.blackLimit??0,
              greyLimit: playerSetting.greyLimit??0,
              orangeLimit: playerSetting.orangeLimit??0,
              yellowLimit: playerSetting.yellowLimit??0,
              redLimit: playerSetting.redLimit??0
            };
            insertCommands.push(insertCommand);
          }
        }
      }
    }

    return insertCommands;
  }

  private isSettingModified(playerSetting: PlayerSetting): boolean {
    const hasLimitDefined = !_.isNil(playerSetting.blackLimit)
      || !_.isNil(playerSetting.greyLimit)
      || !_.isNil(playerSetting.orangeLimit)
      || !_.isNil(playerSetting.yellowLimit)
      || !_.isNil(playerSetting.redLimit);

    return hasLimitDefined;
  }
}
