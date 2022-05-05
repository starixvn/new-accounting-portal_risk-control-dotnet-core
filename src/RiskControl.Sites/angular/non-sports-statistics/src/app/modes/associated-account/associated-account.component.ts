import { Component, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { ModalContext, ModalService } from 'components/modal';
import { GridModalComponent } from 'components/grid-modal';
import { GridContext } from 'components/grid';
import { UserNameQueryModel } from '../user-name';
import { FilterConfig } from '../../filter';
import { AssociatedAccountService } from './associated-account.service';

@Component({
    selector: 'nap-associated-account',
    templateUrl: './associated-account.component.html'
})
export class AssociatedAccountComponent {
    private readonly model: UserNameQueryModel;
    gridOptions: GridOptions;
    gridContext: GridContext = {
        isAutoResize: false
    };

    constructor(
        private readonly modalContext: ModalContext,
        private readonly modalService: ModalService,
        private readonly associatedAccountService: AssociatedAccountService
    ) {
        this.model = modalContext.data as UserNameQueryModel;
        this.associatedAccountService.query(this.model).subscribe(gridOptions => {
            this.updateGridOptions(gridOptions, this.model);
        });
    }

    close() {
        this.modalContext.close();
    }

    onAfterGenerate(grid: ElementRef) {
        $(grid.nativeElement).find('a[grand-total]').on('click', () => {
            this.showGrandTotalDialog();
        });
    }

    private showGrandTotalDialog() {
        const grandTotalQueryModel = _.cloneDeep(this.model);
        grandTotalQueryModel.isGrandTotal = true;
        grandTotalQueryModel.title = `Associated Accounts With ${grandTotalQueryModel.username} (Base RM)`;
        this.associatedAccountService.query(grandTotalQueryModel).subscribe(gridOptions => {
            gridOptions.fullHeight = false;
            gridOptions.gridHeight = 500;
            gridOptions.titleInfo = {
                text: gridOptions.TitleInfoText,
                showExcelButton: true,
                exportExcelFunction: () => this.exportExcelAssociatedAccounts(grandTotalQueryModel)
            };
            this.modalService.open(GridModalComponent, { size: { width: 1200 } }, gridOptions);
        });
    }

    private updateGridOptions(gridOptions: GridOptions, queryModel: UserNameQueryModel) {
        gridOptions.fullHeight = false;
        gridOptions.gridHeight = 500;
        gridOptions.titleInfo = {
            text: gridOptions.TitleInfoText,
            showExcelButton: true,
            exportExcelFunction: () => this.exportExcelAssociatedAccounts(queryModel)
        };
        if (gridOptions.footerRows.length > 0 &&
            !queryModel.isBaseRM &&
            !queryModel.isGrandTotal &&
            queryModel.reportBy !== 'SpecificMember') {
            this.updateGrandTotal(gridOptions);
        }
        this.gridOptions = gridOptions;
    }

    private updateGrandTotal(gridOptions: GridOptions) {
        const row = gridOptions.footerRows[0];
        const column = row.Columns[0];
        const value = column.Value;
        column.Value = `<a href="javascript:;" grand-total>${value}</a>`;
    }

    private exportExcelAssociatedAccounts(queryModel: UserNameQueryModel) {
        this.associatedAccountService.excel(queryModel)
            .subscribe(response => {
                const fileName = `Associated_Accounts_With_${queryModel.username}.xls`;
                Helper.downloadFile(response, fileName);
            });
    }
}
