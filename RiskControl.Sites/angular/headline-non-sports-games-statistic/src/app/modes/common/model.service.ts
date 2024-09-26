import { Injectable } from '@angular/core';
import { Helper } from 'nap-components/helper';
import { ReportType, FilterModel, FilterHelper } from '../../filter';
import { BaseQueryModel, QueryModel, NormalCriteria, HistoryCriteria } from '../../app.model';
import { ModeContext } from '../mode-context';
import { TitleService } from './title.service';
import { DATE_CONFIG } from 'app/common';
import { ProductConstants } from 'app/common/constants';

@Injectable()
export class ModelService {
    constructor(
        private readonly modeContext: ModeContext,
        private readonly titleService: TitleService
    ) { }

    createCriteria(filterModel: FilterModel): NormalCriteria | HistoryCriteria {
        if (filterModel.isNormalMode) {
            return {
                winlostDate: filterModel.startDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD),
                housePTType: filterModel.housePTType,
                housePTValue: filterModel.housePTValue
            };
        } else {
            return {
                fromDate: filterModel.startDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD),
                toDate: filterModel.endDate.format(DATE_CONFIG.dateFormatYYYY_MM_DD)
            };
        }
    }

    getReportBy(reportType: ReportType): string {
        const reportName = FilterHelper.getReportName(reportType).replace(/ /g, '');
        return reportName;
    }

    createQueryModel(): QueryModel {
        const filterModel = this.modeContext.filterModel;
        const gridModel = this.modeContext.gridModel;
        const baseModel: BaseQueryModel = {
            productId: filterModel.productIds.join(','),
            username: filterModel.userName,
            site: filterModel.sites.join(','),
            betType: filterModel.betTypes.join(','),
            leagueId: filterModel.productIds.join(',') === ProductConstants.VIRTUAL_SPORT_5.toString() ?
             filterModel.leagueIds.map(l => l.leagueId).join(',')
             : filterModel.leagueIds.map(l => `${l.leagueId}-${l.betType}`).join(','),
            sportType: filterModel.sportTypes.join(','),
            currency: filterModel.currency.join(','),
            device: filterModel.devices.join(','),
            excludeTest: filterModel.isExcludeTest,
            viewByInteger: filterModel.isViewByInteger,
            totalBetType: filterModel.totalBetType,
            totalBetValue: filterModel.totalBetValue,
            gameIncomeType: filterModel.gameIncomeType,
            gameIncomeValue: filterModel.gameIncomeValue,
            removalColumns: filterModel.removalColumns,
            sortDirection: filterModel.sortDirection,
            sortColumnName: filterModel.sortColumnName,
            reportBy: this.getReportBy(filterModel.reportType),
            isNormalMode: filterModel.isNormalMode,
            title: this.titleService.getTitle(),
            isDrillDown: gridModel.isDrillDownCurrency,
            isGrandTotal: false,
            isBaseRM: filterModel.isBaseRM,
            sportBettype: filterModel.sportBettypes.map(s => `${s.sportType}-${s.betType}`).join(','),
            isExactly: filterModel.isExactly
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
