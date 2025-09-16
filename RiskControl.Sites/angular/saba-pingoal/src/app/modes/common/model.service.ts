import { Injectable } from '@angular/core';
import { Helper } from 'nap-components/helper';
import { QueryModel } from '../../app.model';
import { ModeContext } from '../mode-context';
import { TitleService } from './title.service';
import { DATE_CONFIG } from '../../common';
import { ProductConstants } from 'app/common/constants';
import { FilterModel } from '../../filter/filter.model';
import { filter } from 'lodash';

@Injectable()
export class ModelService {
    constructor(
        private readonly modeContext: ModeContext,
        private readonly titleService: TitleService
    ) { }

    createCriteria(filterModel: FilterModel) {
        return {
            fromDate: filterModel.fromDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD),
            toDate: filterModel.toDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD)
        };
    }

    createQueryModel(): QueryModel {
        const filterModel = this.modeContext.filterModel;
        const gridModel = this.modeContext.gridModel;
        const baseModel: QueryModel = {
            currency: filterModel.currency,
            sortDirection: filterModel.sortDirection,
            sortColumnName: filterModel.sortColumnName,
            title: this.titleService.getTitle(),
            isDrillDown: gridModel.isDrillDownCurrency,
            isGrandTotal: false,
            isExactly: filterModel.isExactly,
            fromDate: filterModel.fromDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD),
            toDate: filterModel.toDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD),
            site: filterModel.site,
            excludeTest: filterModel.excludeTest,
            device: filterModel.device,
            userName: filterModel.userName,
            sportBettype: filterModel.sportBettype,
            leagueGroup: filterModel.leagueGroup,
            reportBy: filterModel.reportType,
            userNameDrillDown: false,
            headerText: "Date",
            removalColumns: filterModel.removalColumns
        };
        const model: QueryModel = Helper.extend(baseModel, this.createCriteria(filterModel));
        return model;
    }

    updateModelToQueryGrandTotal(queryModel: QueryModel) {
        queryModel.isDrillDown = true;
        queryModel.isGrandTotal = true;
        queryModel.sortColumnName = '';
        queryModel.sortDirection = '';
        queryModel.title = this.titleService.getGrandTotalByCurrencyTitle();
    }
}
