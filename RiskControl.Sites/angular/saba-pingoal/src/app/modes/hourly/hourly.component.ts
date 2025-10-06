import { Component, OnInit } from '@angular/core';
import { Helper } from 'nap-components/helper';
import { DATE_CONFIG } from '../../common';
import { ModelService } from '../common/model.service';
import { TitleService } from '../common/title.service';
import { HourlyService } from './hourly.service';
import { HourlyGridModel, HourlyData, HourlyQueryModel } from './hourly.model';
import { ModeGenerate } from '../mode.model';
import { ModeContext } from '../mode-context';
import { ModeController } from '../mode-controller';
import { ColumnService } from '../../filter/column.service';

@Component({
    selector: 'nap-hourly',
    templateUrl: './hourly.component.html',
    styleUrls: [
        './hourly.component.scss'
    ],
    providers: [
        ColumnService,
        HourlyService,
        ModelService,
        TitleService
    ]
})
export class HourlyComponent implements OnInit, ModeGenerate {
    data!: HourlyData;
    accumulatedBreadcrumbItems: string[] = [];
    breadcrumbItems: string[] = [];
    private readonly reportColumns: string[];
    percentFormat: string;
    numberFormat: string;

    constructor(
        private readonly columnService: ColumnService,
        private readonly modeContext: ModeContext,
        private readonly hourlyService: HourlyService,
        private readonly modelService: ModelService,
        private readonly modeController: ModeController
    ) {
        const filterModel = this.modeContext.filterModel;
         this.numberFormat = '0,0.00';
            this.percentFormat = '0,0.00%';
        this.reportColumns = this.columnService.getColumns().map(x => x.value);
    }

    ngOnInit() {
        this.accumulatedBreadcrumbItems = this.modeController.generateBreadcrumbItems();
        this.breadcrumbItems = [`Hourly Statistics Record on ${this.generateDateStringTitle()} (GMT+8)`];
        const queryModel = this.createQueryModel();
        this.hourlyService.query(queryModel).subscribe(data => {
            this.data = data;
        });
    }

    isShowColumn(index: number): boolean {
        const filterModel = this.modeContext.filterModel;
        const columnName = this.reportColumns[index];
        return filterModel.removalColumns.indexOf(columnName) === -1;
    }

    generateTitle(): string {
        const dateString = this.generateDateStringTitle();
        return `Accumulated Hourly Statistics Record on ${dateString} (GMT+8)`;
    }

    onAfterGenerate() { }

    exportExcel() {
        const queryModel = this.createQueryModel();
        this.hourlyService.excel(queryModel)
            .subscribe(response => {
                const fileName = `Hourly Report On ${this.generateDateStringTitle()}.xlsx`.replace(/,/g, '').replace(/ /g, '_');
                Helper.downloadFile(response, fileName);
            });
    }

    goBack(index: number) {
        this.modeController.goBack(index);
    }

    private generateDateStringTitle() {
        const formatString = DATE_CONFIG.dateFormatString;
        const filterModel = this.modeContext.filterModel;
        return filterModel.fromDate.format(formatString);
    }

    private createQueryModel(): HourlyQueryModel {
        const gridModel = this.modeContext.gridModel;
        const queryModel = this.modelService.createQueryModel();

        let userNameDrillDown = false;
        if (gridModel instanceof HourlyGridModel) {
            userNameDrillDown = gridModel.isDrillDownFromUserName;
        }

        return Helper.extend(queryModel, {
            userNameDrillDown: userNameDrillDown
        });
    }
}
