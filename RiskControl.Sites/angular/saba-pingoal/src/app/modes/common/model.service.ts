import { Injectable } from '@angular/core';
import { Helper } from 'nap-components/helper';
import { QueryModel } from '../../app.model';
import { ModeContext } from '../mode-context';
import { TitleService } from './title.service';
import { DATE_CONFIG } from '../../common';
import { ProductConstants } from 'app/common/constants';
import { FilterModel } from '../../filter/filter.model';

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
            productId: filterModel.productIds.join(','),
            username: filterModel.userName,
            site: filterModel.sites.join(','),
            betType: filterModel.betTypes.join(','),
            sportType: filterModel.sportTypes.join(','),
            currency: filterModel.currency.join(','),
            device: filterModel.devices.join(','),
            excludeTest: filterModel.isExcludeTest,
            removalColumns: filterModel.removalColumns,
            sortDirection: filterModel.sortDirection,
            sortColumnName: filterModel.sortColumnName,
            title: this.titleService.getTitle(),
            isDrillDown: gridModel.isDrillDownCurrency,
            isGrandTotal: false,
            isBaseRM: filterModel.isBaseRM,
            sportBettype: filterModel.sportBettypes.map(s => `${s.sportType}-${s.betType}`).join(','),
            isExactly: filterModel.isExactly,
            fromDate: filterModel.fromDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD),
            toDate: filterModel.toDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD),
            custId: filterModel.custId,
            headline: filterModel.headline,
            roleId: filterModel.roleId,
            excludeNoData: filterModel.excludeNoData,
            leagueId: '1',
        
            
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
