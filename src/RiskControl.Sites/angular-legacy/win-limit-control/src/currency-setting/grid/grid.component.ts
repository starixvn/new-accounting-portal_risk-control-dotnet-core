import { Component, Input, OnChanges, OnInit, ViewChildren, QueryList } from '@angular/core';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationService as NgxPaginationService, PaginatePipe } from 'ngx-pagination';
import { PaginationInstance, PaginationService } from 'nap-components/pagination';
import { ToastService, MessageType } from 'nap-components/toast';
import { ConfirmationService } from 'nap-components/confirmation';
import { GroupSettingService } from '../../common/group-setting';
import { WinLimitValidatorDirective } from '../../common/win-limit-textbox';
import { LossLimitValidatorDirective } from '../../common/loss-limit-textbox';
import { AuthorizationService } from '../../common/authorization';
import { FilterModel } from '../filter';
import { ProductSetting, ProductSettingGroup } from './grid.model';
import { GridService } from './grid.service';

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
    @ViewChildren(LossLimitValidatorDirective) lossLimitValidatorDirectives: QueryList<LossLimitValidatorDirective>;
    @ViewChildren(WinLimitValidatorDirective) winLimitValidatorDirectives: QueryList<WinLimitValidatorDirective>;
    @Input() filterModel: FilterModel;
    breadcrumbItems: string[];
    paginationInstance: PaginationInstance;
    blackLimit: number = null;
    greyLimit: number = null;
    orangeLimit: number;
    yellowLimit: number;
    redLimit: number;
    isBlockedPlacebetRedLevel = false;
    isBlockedTransferRedLevel = false;
    productSettings: ProductSetting[];
    displayedProductSettings: ProductSetting[];
    hasHostPermission: boolean;
    private paginatePipe: PaginatePipe;

    constructor(
        private modalService: NgbModal,
        private paginationService: PaginationService,
        private gridService: GridService,
        private ngxPaginationService: NgxPaginationService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        private groupSettingService: GroupSettingService,
        private authorizationService: AuthorizationService
    ) {
        this.paginatePipe = new PaginatePipe(this.ngxPaginationService);
    }

    ngOnInit() {
        this.queryHostPermission();
    }

    ngOnChanges() {
        if (this.filterModel) {
            this.resetForm();
            this.breadcrumbItems = [`${this.filterModel.productName} - Currency Win Loss Limit Setting`];
            this.search();
        }
    }

    applyBlackLimit() {
        if (!_.isNil(this.blackLimit)) {
            this.populateGroupSetting(group => group.BlackLimit = this.blackLimit);
        }
    }

    applyGreyLimit() {
        if (!_.isNil(this.greyLimit)) {
            this.populateGroupSetting(group => group.GreyLimit = this.greyLimit);
        }
    }

    applyOrangeLimit() {
        if (!_.isNil(this.orangeLimit)) {
            this.populateGroupSetting(group => group.OrangeLimit = this.orangeLimit);
        }
    }

    applyYellowLimit() {
        if (!_.isNil(this.yellowLimit)) {
            this.populateGroupSetting(group => group.YellowLimit = this.yellowLimit);
        }
    }

    applyRedLimit() {
        if (!_.isNil(this.redLimit)) {
            this.populateGroupSetting(group => group.RedLimit = this.redLimit);
        }
    }

    applyRedBlockPlacebet() {
        this.populateGroupSetting(group => group.IsBlockedPlacebetRedLevel = this.isBlockedPlacebetRedLevel);
    }

    applyRedBlockTransfer() {
        this.populateGroupSetting(group => {
            if (!group.IsCreditSite) {
                group.IsBlockedTransferRedLevel = this.isBlockedTransferRedLevel;
            }
        });
    }

    save() {
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

        const modifiedSettings = this.getModifiedSettings();
        if (modifiedSettings.length === 0) {
            this.toastService.activate('There is no change to save', MessageType.Warning);
            return;
        }
        this.confirmationService.openContent(
            'Are you sure want to change this setting?',
            () => this.internalSave(modifiedSettings)
        );
    }

    cancel() {
        this.generateDisplayedProductSettings();
        this.resetForm();
    }

    showGroupSetting(productName: string) {
        this.groupSettingService.show(productName);
    }

    onPageChange() {
        this.generateDisplayedProductSettings();
        this.onIsBlockedPlacebetRedLevelChange();
        this.onIsBlockedTransferRedLevelChange();
    }

    onIsBlockedPlacebetRedLevelChange() {
        let isBlockedPlacebetRedLevel = true;
        this.populateGroupSetting(group => {
            if (isBlockedPlacebetRedLevel && !group.IsBlockedPlacebetRedLevel) {
                isBlockedPlacebetRedLevel = false;
            }
        });
        this.isBlockedPlacebetRedLevel = isBlockedPlacebetRedLevel;
    }

    onIsBlockedTransferRedLevelChange() {
        let isBlockedTransferRedLevel = true;
        this.populateGroupSetting(group => {
            if (isBlockedTransferRedLevel && !group.IsBlockedTransferRedLevel) {
                isBlockedTransferRedLevel = false;
            }
        });
        this.isBlockedTransferRedLevel = isBlockedTransferRedLevel;
    }

    private search() {
        this.productSettings = undefined;
        this.gridService.query(this.filterModel).subscribe(productSettings => {
            this.productSettings = productSettings;
            this.paginationInstance = this.paginationService.createPaginationInstance(this.productSettings.length);
            this.onPageChange();
        });
    }

    private fetch() {
        const currentPage = this.paginationInstance.currentPage;
        this.gridService.query(this.filterModel, { noToast: true }).subscribe(productSettings => {
            this.productSettings = productSettings;
            this.paginationInstance = this.paginationService.createPaginationInstance(this.productSettings.length);
            this.paginationInstance.currentPage = currentPage;
            this.onPageChange();
        });
    }

    private queryHostPermission() {
        this.authorizationService.getHostPermission().subscribe((result) => {
            this.hasHostPermission = result.CurrencyWinLimitSetting;
        });
    }

    private resetForm() {
        this.isBlockedPlacebetRedLevel = false;
        this.isBlockedTransferRedLevel = false;
        this.blackLimit = undefined;
        this.greyLimit = undefined;
        this.orangeLimit = undefined;
        this.yellowLimit = undefined;
        this.redLimit = undefined;
    }

    private generateDisplayedProductSettings() {
        const paginateProductSettings = this.paginatePipe.transform(this.productSettings, this.paginationInstance);
        this.displayedProductSettings = _.cloneDeep(paginateProductSettings);
    }

    private populateGroupSetting(exec: (group: ProductSettingGroup) => void) {
        this.displayedProductSettings.forEach(setting => {
            setting.Groups.forEach(group => exec(group));
        });
    }

    private getModifiedSettings(): ProductSettingGroup[] {
        const commandSettings: ProductSettingGroup[] = [];
        const paginateProductSettings: ProductSetting[] = this.paginatePipe.transform(this.productSettings, this.paginationInstance);
        for (let i = 0; i < this.displayedProductSettings.length; i++) {
            const displayedProductSetting = this.displayedProductSettings[i];
            for (let j = 0; j < displayedProductSetting.Groups.length; j++) {
                if (!_.isEqual(displayedProductSetting.Groups[j], paginateProductSettings[i].Groups[j])) {
                    commandSettings.push(displayedProductSetting.Groups[j]);
                }
            }
        }

        return commandSettings;
    }

    private internalSave(settings: ProductSettingGroup[]) {
        this.gridService.update(settings).subscribe(result => {
            if (result.ErrorCode === 0) {
                this.toastService.activate('The setting has been updated successfully!', MessageType.Success, 3);
                this.fetch();
            } else {
                const message = 'Please input Black level limit < Grey level limit <= 0'
                    + ' <= Orange level limit < Yellow level limit < Red level limit.';
                this.toastService.activate(message, MessageType.Danger);
            }
        });
    }
}
