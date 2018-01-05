import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ToastService, MessageType } from 'nap-components/toast';
import { ConfirmationService } from 'nap-components/confirmation';
import { GroupSettingService } from '../../common/group-setting';
import { EditableWinLimitComponent } from '../../common/editable-win-limit';
import { EditableLossLimitComponent } from '../../common/editable-loss-limit';
import { CommandResult } from '../../common/model';
import { AuthorizationService } from '../../../services/authorization.service';
import { LimitLevel } from '../../common/filter';
import { FilterModel } from '../filter';
import { InsertService } from '../insert';
import { PlayerCurrencySetting, PlayerSetting, DeleteCommand, UpdateCommand } from './grid.model';
import { GridService } from './grid.service';

type EditableLimitComponent = EditableWinLimitComponent | EditableLossLimitComponent;

@Component({
    selector: 'nap-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        GridService,
        AuthorizationService
    ]
})
export class GridComponent implements OnInit, OnChanges {
    @Input() filterModel: FilterModel;
    playerCurrencySettings: PlayerCurrencySetting[] | undefined;
    hasHostPermission: boolean;
    private editComponent: EditableLimitComponent | undefined;

    constructor(
        private gridService: GridService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        private groupSettingService: GroupSettingService,
        private authorizationService: AuthorizationService,
        private insertService: InsertService
    ) { }

    ngOnInit() {
        this.queryHostPermission();
    }

    ngOnChanges() {
        this.toastService.deactivate();
        if (this.filterModel) {
            this.search();
        }
    }

    showGroupSetting(productName: string) {
        this.groupSettingService.show(productName);
    }

    addPlayer() {
        this.insertService.show().subscribe(() => {
            this.ngOnChanges();
        });
    }

    deletePlayer(playerSetting: PlayerSetting) {
        this.confirmationService.openContent(
            'Are you sure you want to remove setting of this customer for this game?',
            () => this.internalDeletePlayer(playerSetting)
        );
    }

    onEditLimit(component: EditableLimitComponent) {
        if (this.editComponent && this.editComponent !== component) {
            this.editComponent.closeEdit();
        }

        this.editComponent = component;
    }

    saveBlackLimit(isValid: boolean, playerSetting: PlayerSetting, value: number) {
        const validBlackLimit = playerSetting.BlackLimit ? playerSetting.BlackLimit : 0;
        this.saveLimit(isValid, playerSetting, value, validBlackLimit, LimitLevel.Black,
            () => playerSetting.BlackLimit = value);
    }

    saveGreyLimit(isValid: boolean, playerSetting: PlayerSetting, value: number) {
        const validGreyLimit = playerSetting.GreyLimit ? playerSetting.GreyLimit : 0;
        this.saveLimit(isValid, playerSetting, value, validGreyLimit, LimitLevel.Grey,
            () => playerSetting.GreyLimit = value);
    }

    saveOrangeLimit(isValid: boolean, playerSetting: PlayerSetting, value: number) {
        const validOrangeLimit = playerSetting.OrangeLimit ? playerSetting.OrangeLimit : 0;
        this.saveLimit(isValid, playerSetting, value, validOrangeLimit, LimitLevel.Orange,
            () => playerSetting.OrangeLimit = value);
    }

    saveYellowLimit(isValid: boolean, playerSetting: PlayerSetting, value: number) {
        const validYellowLimit = playerSetting.YellowLimit ? playerSetting.YellowLimit : 0;
        this.saveLimit(isValid, playerSetting, value, validYellowLimit, LimitLevel.Yellow,
            () => playerSetting.YellowLimit = value);
    }

    saveRedLimit(isValid: boolean, playerSetting: PlayerSetting, value: number) {
        const validRedLimit = playerSetting.RedLimit ? playerSetting.RedLimit : 0;
        this.saveLimit(isValid, playerSetting, value, validRedLimit, LimitLevel.Red,
            () => playerSetting.RedLimit = value);
    }

    private queryHostPermission() {
        this.authorizationService.hasHostPermission().subscribe((result) => {
            this.hasHostPermission = result;
        });
    }

    private saveLimit(isValid: boolean, playerSetting: PlayerSetting, value: number, orginalValue: number,
        levelId: number, updateFn: () => void) {
        if (!this.editComponent) {
            return;
        }

        const validEditComponent = this.editComponent;
        if (_.isNil(value)) {
            this.editComponent.value = orginalValue;
            this.editComponent.closeEdit();
            return;
        }

        if (this.editComponent.value === orginalValue) {
            this.editComponent.closeEdit();
            return;
        }

        if (!isValid) {
            this.editComponent.openEdit();
            return;
        }

        this.confirmationService.openContent(`Are you sure want to change setting of ${playerSetting.Username}?`,
            () => {
                updateFn();
                this.internalSaveLimit(playerSetting, levelId, value);
            },
            () => validEditComponent.value = orginalValue
        );
        this.editComponent.closeEdit();
    }

    private internalSaveLimit(playerSetting: PlayerSetting, levelId: number, value: number) {
        const command: UpdateCommand = {
            CustId: playerSetting.CustId,
            GroupId: playerSetting.GroupId,
            LevelId: levelId,
            ProductId: playerSetting.ProductId,
            Limit: value
        };
        this.gridService.update(command).subscribe((result) => {
            if (result.ErrorCode !== 0) {
                const message = 'Please input Black level limit < Grey level limit <= 0'
                    + ' <= Orange level limit < Yellow level limit < Red level limit.';
                this.toastService.activate(message, MessageType.Danger);
            } else {
                const message = 'The Player Win Loss Limit(s) has been updated successfully!';
                this.toastService.activate(message, MessageType.Success, 3);
            }
        });
    }

    private search() {
        this.playerCurrencySettings = undefined;
        this.gridService.query(this.filterModel).subscribe(playerCurrencySettings => {
            this.playerCurrencySettings = playerCurrencySettings;
        });
    }

    private internalDeletePlayer(playerSetting: PlayerSetting) {
        const command: DeleteCommand = {
            CustId: playerSetting.CustId,
            ProductId: playerSetting.ProductId,
            GroupId: playerSetting.GroupId
        };
        this.gridService.delete(command).subscribe(result => {
            if (result.ErrorCode === 0) {
                this.search();
            } else {
                this.toastService.activate('Can not remove player setting!', MessageType.Danger);
            }
        });
    }
}
