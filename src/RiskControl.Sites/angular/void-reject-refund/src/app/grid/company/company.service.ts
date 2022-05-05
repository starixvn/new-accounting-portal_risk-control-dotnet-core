
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Helper } from 'nap-components/helper';
import { HttpService } from 'nap-components/http';
import { GroupStatisticReportModel, ExcelQueryModel, QueryModel } from 'src/app/common/model';
import { QueryModelService } from 'src/app/common/query-model.service';
import { FilterModel } from 'src/app/filter/filter.model';

@Injectable()
export class CompanyService {
    private readonly url = 'api/void-reject-refund/company';

    constructor(
        private readonly httpService: HttpService,
        private readonly queryModelService: QueryModelService
    ) { }

    query(filterModel: FilterModel): Observable<GroupStatisticReportModel> {
        const queryModel = this.createQueryModel(filterModel);
        return this.httpService.post<GroupStatisticReportModel>(this.url, queryModel);
    }

    exportExcel(title: string, filterModel: FilterModel) {
        const url = `${this.url}/excel`;
        const excelQueryModel = this.createExcelQueryModel(title, filterModel);
        const fromDate = moment(excelQueryModel.fromDate).format('MMM_DD_YYYY');
        const toDate = moment(excelQueryModel.toDate).format('MMM_DD_YYYY');
        this.httpService.download(url, excelQueryModel).subscribe(response => {
            const fileName = `Company_Void_Reject_Refund_Report_From_${fromDate}_To_${toDate}.xlsx`;
            Helper.downloadFile(response, fileName);
        });
    }

    private createQueryModel(filterModel: FilterModel): QueryModel {
        return this.queryModelService.createQueryModel(filterModel);
    }

    private createExcelQueryModel(title: string, filterModel: FilterModel): ExcelQueryModel {
        return this.queryModelService.createExcelQueryModel(title, filterModel);
    }
}
