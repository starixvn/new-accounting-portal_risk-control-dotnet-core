import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FilterHelper } from './../filter/filter-helper';
import { FilterModel, ReportType } from '../filter/filter.model';
import { QueryModel, ExcelQueryModel } from './model';

@Injectable()
export class QueryModelService {
    createQueryModel(filterModel: FilterModel): QueryModel {
        const queryModel: QueryModel = {
            fromDate: filterModel.fromDate,
            toDate: filterModel.toDate,
            productId: filterModel.productIds.join(','),
            site: filterModel.sites.join(','),
            bettype: filterModel.betTypes.join(','),
            leagueId: filterModel.leagueIds.map(l => `${l.leagueId}-${l.betType}`).join(','),
            sportType: filterModel.sportTypes.join(','),
            currency: filterModel.currency.join(','),
            device: filterModel.devices.join(','),
            excludeTest: filterModel.isExcludeTest,
            reportBy: this.getReportType(filterModel.reportType),
            sortColumnName: filterModel.sortColumnName,
            sortDirection: filterModel.sortDirection,
            sportBettype: filterModel.sportBettypes.map(s => `${s.sportType}-${s.betType}`).join(',')
        };

        return queryModel;
    }

    createExcelQueryModel(tile: string, filterModel: FilterModel): ExcelQueryModel {
        const queryModel = this.createQueryModel(filterModel);
        const excelQueryModel: ExcelQueryModel = _.extend({}, { title: tile }, queryModel);
        return excelQueryModel;
    }

    private getReportType(reportType: ReportType): number {
        return FilterHelper.getReportType(reportType);
    }
}
