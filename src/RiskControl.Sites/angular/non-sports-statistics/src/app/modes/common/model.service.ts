import { Injectable } from '@angular/core';
import { DateHelper, DateFormat } from 'nap-components/date';
import { Helper } from 'nap-components/helper';
import { ReportType, FilterModel, FilterHelper } from '../../filter';
import { BaseQueryModel, QueryModel, NormalCriteria, HistoryCriteria } from '../../app.model';
import { ModeContext } from '../mode-context';
import { TitleService } from './title.service';

@Injectable()
export class ModelService {
    constructor(
        private readonly modeContext: ModeContext,
        private readonly titleService: TitleService
    ) { }

    createCriteria(filterModel: FilterModel): NormalCriteria | HistoryCriteria {
        if (filterModel.isNormalMode) {
            return {
                winlostDate: DateHelper.formatMomentDate(filterModel.startDate, DateFormat.Date),
                housePTType: filterModel.housePTType,
                housePTValue: filterModel.housePTValue
            };
        } else {
            return {
                fromDate: DateHelper.formatMomentDate(filterModel.startDate, DateFormat.Date),
                toDate: DateHelper.formatMomentDate(filterModel.endDate, DateFormat.Date)
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
            leagueId: filterModel.leagueIds.map(l => `${l.leagueId}-${l.betType}`).join(','),
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
            sortDirection: '',
            sortColumnName: '',
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
        queryModel.title = this.titleService.getGrandTotalByCurrencyTitle();
    }
}
