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
import { ClickedAllPageModel, InactiveSite, ProductSetting, ProductSettingGroup } from './grid.model';
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
    tempProductSettings: ProductSetting[];
    hasHostPermission: boolean;
    isAllDisabledBlockedTransferRedLevel = true;
    clickedAllPageModel = {} as ClickedAllPageModel;
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
            this.populateGroupSettingOnAllPage(group => group.blackLimit = this.blackLimit);
            this.clickedAllPageModel.blackLimit = this.blackLimit;
        }
    }

    applyGreyLimit() {
        if (!_.isNil(this.greyLimit)) {
            this.populateGroupSettingOnAllPage(group => group.greyLimit = this.greyLimit);
            this.clickedAllPageModel.greyLimit = this.greyLimit;
        }
    }

    applyOrangeLimit() {
        if (!_.isNil(this.orangeLimit)) {
            this.populateGroupSettingOnAllPage(group => group.orangeLimit = this.orangeLimit);
            this.clickedAllPageModel.orangeLimit = this.orangeLimit;
        }
    }

    applyYellowLimit() {
        if (!_.isNil(this.yellowLimit)) {
            this.populateGroupSettingOnAllPage(group => group.yellowLimit = this.yellowLimit);
            this.clickedAllPageModel.yellowLimit = this.yellowLimit;
        }
    }

    applyRedLimit() {
        if (!_.isNil(this.redLimit)) {
            this.populateGroupSettingOnAllPage(group => group.redLimit = this.redLimit);
            this.clickedAllPageModel.redLimit = this.redLimit;
        }
    }

    applyRedBlockPlacebet() {
        this.populateGroupSettingOnAllPage(group => group.isBlockedPlacebetRedLevel = this.isBlockedPlacebetRedLevel);
        this.clickedAllPageModel.blockedPlaceBet = this.isBlockedPlacebetRedLevel;
    }

    applyRedBlockTransfer() {
        this.populateGroupSettingOnAllPage(group => {
            if (!group.isCreditSite) {
                group.isBlockedTransferRedLevel = this.isBlockedTransferRedLevel;
            }
            this.clickedAllPageModel.blockedTransfer = this.isBlockedTransferRedLevel;
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
        this.populateGroupSettingOnAllPage(group => {
            if (isBlockedPlacebetRedLevel && !group.isBlockedPlacebetRedLevel) {
                isBlockedPlacebetRedLevel = false;
            }
        });
        this.isBlockedPlacebetRedLevel = isBlockedPlacebetRedLevel;
    }

    onIsBlockedTransferRedLevelChange() {
        let isBlockedTransferRedLevel = true;
        this.isAllDisabledBlockedTransferRedLevel = true;
        this.populateGroupSettingOnAllPage(group => {
            if (isBlockedTransferRedLevel && !group.isBlockedTransferRedLevel && !group.isCreditSite) {
                isBlockedTransferRedLevel = false;
            }
            if (!group.isCreditSite) {
                this.isAllDisabledBlockedTransferRedLevel = false;
            }
        });
        this.isBlockedTransferRedLevel = isBlockedTransferRedLevel;
        if (this.isAllDisabledBlockedTransferRedLevel) {
            this.isBlockedTransferRedLevel = false;
        }
    }

    private search() {
        this.productSettings = undefined;
        this.clickedAllPageModel = {} as ClickedAllPageModel;
        this.gridService.query(this.filterModel).subscribe(productSettings => {
            this.productSettings = productSettings;
            this.tempProductSettings = _.cloneDeep(this.productSettings);
            this.paginationInstance = this.paginationService.createPaginationInstance(this.productSettings.length);
            this.onPageChange();
        });
    }

    private fetch() {
        const currentPage = this.paginationInstance.currentPage;
        this.clickedAllPageModel = {} as ClickedAllPageModel;
        this.gridService.query(this.filterModel, { noToast: true }).subscribe(productSettings => {
            this.productSettings = productSettings;
            this.tempProductSettings = _.cloneDeep(this.productSettings);
            this.paginationInstance = this.paginationService.createPaginationInstance(this.productSettings.length);
            this.paginationInstance.currentPage = currentPage;
            this.onPageChange();
        });
    }

    private queryHostPermission() {
        this.authorizationService.getHostPermission().subscribe((result) => {
            this.hasHostPermission = result.currencyWinLimitSetting;
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
        this.displayedProductSettings = this.paginatePipe.transform(this.tempProductSettings, this.paginationInstance);
    }

    private populateGroupSettingOnAllPage(exec: (group: ProductSettingGroup) => void) {
        this.displayedProductSettings.forEach(setting => {
            setting.groups.forEach(group => exec(group));
        });
        this.tempProductSettings.forEach(setting => {
            setting.groups.forEach(group => exec(group));
        });
    }

    private getModifiedSettings(): ProductSettingGroup[] {
        const commandSettings: ProductSettingGroup[] = [];
        for (let i = 0; i < this.tempProductSettings.length; i++) {
            const temp = this.tempProductSettings[i];
            for (let j = 0; j < temp.groups.length; j++) {
                if (!_.isEqual(temp.groups[j], this.productSettings[i].groups[j])) {
                    commandSettings.push(temp.groups[j]);
                }
            }
        }

        return commandSettings;
    }

    private getInactiveSites(): InactiveSite[] {
        const result: InactiveSite[] = [];
        if (!_.isNil(this.clickedAllPageModel.blackLimit)) {
            result.push(this.createInactiveSiteModel(102, this.clickedAllPageModel.blackLimit, false, false));
        }
        if (!_.isNil(this.clickedAllPageModel.greyLimit)) {
            result.push(this.createInactiveSiteModel(101, this.clickedAllPageModel.greyLimit, false, false));
        }
        if (!_.isNil(this.clickedAllPageModel.orangeLimit)) {
            result.push(this.createInactiveSiteModel(1, this.clickedAllPageModel.orangeLimit, false, false));
        }
        if (!_.isNil(this.clickedAllPageModel.yellowLimit)) {
            result.push(this.createInactiveSiteModel(2, this.clickedAllPageModel.yellowLimit, false, false));
        }
        if (!_.isNil(this.clickedAllPageModel.redLimit)) {
            result.push(this.createInactiveSiteModel(3, this.clickedAllPageModel.redLimit, this.isBlockedPlacebetRedLevel, this.isBlockedTransferRedLevel));
        } else {
            if (!_.isNil(this.clickedAllPageModel.blockedPlaceBet) || !_.isNil(this.clickedAllPageModel.blockedTransfer)) {
                const redLimit = this.productSettings[0].groups[0].redLimit;
                result.push(this.createInactiveSiteModel(3, redLimit, this.isBlockedPlacebetRedLevel, this.isBlockedTransferRedLevel));
            }
        }
        return result;
    }

    private createInactiveSiteModel(level: number, maxWinLimit: number, isBlockedPlaceBet: boolean, isBlockedTransfer: boolean): InactiveSite {
        const model: InactiveSite = {
            productId: this.filterModel.productId,
            groupId: this.filterModel.groupId,
            levelId: level,
            exchangeID: this.filterModel.currencyId,
            maxWinLimit: maxWinLimit,
            isBlockedPlaceBet: isBlockedPlaceBet,
            isBlockedTransfer: isBlockedTransfer
        };
        return model;
    }

    private internalSave(settings: ProductSettingGroup[]) {
        this.gridService.update(settings).subscribe(result => {
            if (result.errorCode === 0) {
                const inactiveSites = this.getInactiveSites();
                if (this.filterModel.multiSite === '0' && inactiveSites.length > 0)
                {
                    this.gridService.updateInactiveSite(inactiveSites).subscribe(data => {
                        if (data.errorCode === 0) {
                            this.toastService.activate('The setting has been updated successfully!', MessageType.Success, 3);
                            this.fetch();
                        } else {
                            this.toastService.activate('Failed!!! Please try again', MessageType.Danger);
                        }
                    });
                } else {
                    this.toastService.activate('The setting has been updated successfully!', MessageType.Success, 3);
                    this.fetch();
                }
            } else {
                const message = 'Please input Black level limit < Grey level limit <= 0'
                    + ' <= Orange level limit < Yellow level limit < Red level limit.';
                this.toastService.activate(message, MessageType.Danger);
            }
        });
    }
}
