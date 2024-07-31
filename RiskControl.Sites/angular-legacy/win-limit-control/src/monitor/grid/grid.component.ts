import { Component, Input, OnInit, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { PaginationService as NgxPaginationService, PaginatePipe } from 'ngx-pagination';
import { PaginationInstance, PaginationService, PaginationConfig } from 'nap-components/pagination';
import { ToastService, MessageType } from 'nap-components/toast';
import { CountdownTimerComponent } from 'nap-components/countdown-timer';
import { ConfirmationService } from 'nap-components/confirmation';
import { HostPermission } from '../../common/model';
import { AuthorizationService } from '../../common/authorization';
import { TableColumn } from '../common/column';
import { FilterModel } from '../filter';
import { HistoryService } from '../history';
import { AccountService } from '../account';
import { GridColumns } from '../common/column';
import { MonitorModel, UnblockCommand, WinLossAnalysisExcel } from './grid.model';
import { GridService } from './grid.service';
import { AudioWrapper } from './audio-wrapper';
import { LimitLevel } from '../../common/filter';
import { Helper } from 'nap-components/helper';

const scrollWidth = 20;

@Component({
    selector: 'nap-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        AudioWrapper,
        GridService,
        AuthorizationService
    ]
})
export class GridComponent implements OnInit, OnChanges, OnDestroy {
    @Input() filterModel: FilterModel;
    @ViewChild(CountdownTimerComponent) countdownTimerComponent: CountdownTimerComponent;
    breadcrumbItems = ['Win Loss Limit Monitor'];
    paginationInstance: PaginationInstance;
    monitorModels: MonitorModel[];
    displayedModels: MonitorModel[];
    volumnOn = true;
    hostPermission: HostPermission;
    columns: GridColumns;
    width = scrollWidth;
    colspan: number;
    rowspan: number;

    private paginatePipe: PaginatePipe;
    private alertMessageBlurTimer: NodeJS.Timer = undefined;
    private alertMessageTimeout = 120 * 1000;

    constructor(
        private paginationService: PaginationService,
        private gridService: GridService,
        private ngxPaginationService: NgxPaginationService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        private authorizationService: AuthorizationService,
        private historyService: HistoryService,
        private accountService: AccountService,
        private audioWrapper: AudioWrapper,
    ) {
        this.paginatePipe = new PaginatePipe(this.ngxPaginationService);
        this.audioWrapper.create('monitor/assets/koekoeksklok.mp3');
    }

    ngOnInit() {
        this.queryHostPermission();
    }

    ngOnDestroy() {
        this.clearAlertTimeout();
    }

    private queryHostPermission() {
        this.authorizationService.getHostPermission().subscribe((result) => {
            this.hostPermission = result;
        });
    }

    ngOnChanges() {
        if (this.filterModel) {
            this.search();
        }
    }

    onPageChange() {
        const displayedModels = this.paginatePipe.transform(this.monitorModels, this.paginationInstance);
        this.displayedModels = _.cloneDeep(displayedModels);
    }

    toggleVolume() {
        this.volumnOn = !this.volumnOn;
    }

    countdownCallback() {
        this.search();
    }

    private checkNotification() {
        const needToNotifyUser = _.some(this.monitorModels, { IsNotified: false });
        if (needToNotifyUser) {
            this.showAlertMessage();
            this.playSound();
        }
    }

    private showAlertMessage() {
        this.clearAlertTimeout();
        this.toastService.activate('Players have reached Company Limit setting. Please check again.', MessageType.Danger);
        this.alertMessageBlurTimer = setTimeout(() => {
            this.toastService.deactivate();
        }, this.alertMessageTimeout);
    }

    private clearAlertTimeout() {
        if (this.alertMessageBlurTimer !== undefined) {
            clearTimeout(this.alertMessageBlurTimer);
            this.alertMessageBlurTimer = undefined;
        }
    }

    private playSound() {
        if (this.volumnOn) {
            this.audioWrapper.play();
        }
    }

    onUnblockPlaceBet(monitorModel: MonitorModel) {
        this.confirmationService.openContent(
            `Are you sure you want to UnBlock player ${monitorModel.userName} on ${monitorModel.productName} product?`,
            () => this.internalUnblockPlaceBet(monitorModel),
            () => monitorModel.isBlockedPlaceBet = true
        );
        return false;
    }

    private internalUnblockPlaceBet(monitorModel: MonitorModel) {
        const unblockCommand: UnblockCommand = {
            custId: monitorModel.custId,
            productId: monitorModel.productId,
            groupId: monitorModel.groupId
        };

        this.gridService.unblockPlaceBet(unblockCommand).subscribe(commandResult => {
            monitorModel.isBlockedPlaceBet = commandResult.errorCode !== 0;
            this.ngOnChanges();
        });
    }

    onUnblockTransfer(monitorModel: MonitorModel) {
        this.confirmationService.openContent(
            `Are you sure you want to UnBlock player ${monitorModel.userName} on ${monitorModel.productName} product?`,
            () => this.internalUnblockTransfer(monitorModel),
            () => monitorModel.isBlockedTransfer = true
        );
        return false;
    }

    private internalUnblockTransfer(monitorModel: MonitorModel) {
        const unblockCommand: UnblockCommand = {
            custId: monitorModel.custId,
            productId: monitorModel.productId,
            groupId: monitorModel.groupId
        };

        this.gridService.unblockTransfer(unblockCommand).subscribe(commandResult => {
            monitorModel.isBlockedTransfer = commandResult.errorCode !== 0;
            this.ngOnChanges();
        });
    }

    onShowAccount(monitorModel: MonitorModel) {
        this.accountService.show(monitorModel);
    }

    onShowHistory(monitorModel: MonitorModel, hasHostPermission: boolean) {
        this.historyService.show(monitorModel, hasHostPermission);
    }

    private search() {
        this.columns = this.filterModel.columns;
        this.calculateRowspanColspanAndWidth();
        let isCountdownRunning = true;
        if (this.countdownTimerComponent) {
            isCountdownRunning = this.countdownTimerComponent.isRunning;
            this.countdownTimerComponent.pause();
        }

        this.monitorModels = undefined;
        this.gridService.query(this.filterModel).subscribe(monitorModels => {
            if (this.countdownTimerComponent && isCountdownRunning) {
                this.countdownTimerComponent.start();
            }

            this.monitorModels = monitorModels;
            this.paginationInstance = this.paginationService.createPaginationInstance(this.monitorModels.length);
            this.onPageChange();
            this.checkNotification();
        });
    }

    private calculateRowspanColspanAndWidth() {
        this.rowspan = this.columns.winLimitLevel.checked || this.columns.lossLimitLevel.checked ? 2 : 1;
        this.colspan = 0;
        this.width = scrollWidth;
        for (const columnName in this.columns) {
            if (this.columns.hasOwnProperty(columnName)) {
                const column: TableColumn = this.columns[columnName];
                if (column.checked) {
                    if (column === this.columns.lossLimitLevel) {
                        this.colspan += 2;
                    } else if (column === this.columns.winLimitLevel) {
                        this.colspan += 3;
                    } else {
                        this.colspan += 1;
                    }
                    this.width += column.width;
                }
            }
        }
    }

    isRedLimitLevel(level: number): boolean {
        return level === LimitLevel.Red;
    }

    exportExcel(monitorModel: MonitorModel): void {
        const winLossAnalysisExcel: WinLossAnalysisExcel = {
            custId: monitorModel.custId,
            productId: monitorModel.productId,
            reachedLimitTime: monitorModel.reachedLimitTime,
            username: monitorModel.userName
        };
        this.gridService.exportExcel(winLossAnalysisExcel).subscribe(response => {
          var contentDisposition = response.headers.get('content-disposition');
          var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
          Helper.downloadFile(response.body, `${filename}`);
        });
    }
}
