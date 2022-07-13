import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { HttpService } from 'nap-components/http';
import { Helper } from 'nap-components/helper';
import { QueryModelService } from 'src/app/common/query-model.service';
import { FilterModel } from 'src/app/filter/filter.model';
import { QueryModel } from 'src/app/common/model';
import { ProductModel } from './product.model';



@Injectable()
export class ProductService {
    private readonly url = 'api/void-reject-refund/product';

    constructor(
        private readonly httpService: HttpService,
        private readonly queryModelService: QueryModelService
    ) { }

    query(filterModel: FilterModel): Observable<ProductModel> {
        const queryModel = this.createQueryModel(filterModel);
        return this.httpService.post<ProductModel>(this.url, queryModel).pipe(map(result => {
            result.productStatistics.forEach(item => {
                item.isCollapse = true;
            });

            return result;
        }));
    }

    exportExcel(title: string, filterModel: FilterModel) {
        const url = `${this.url}/excel`;
        const excelQueryModel = this.createExcelQueryModel(title, filterModel);
        const fromDate = moment(excelQueryModel.fromDate).format('MMM_DD_YYYY');
        const toDate = moment(excelQueryModel.toDate).format('MMM_DD_YYYY');
        this.httpService.download(url, excelQueryModel).subscribe(response => {
            const fileName = `Product_Void_Reject_Refund_Report_From_${fromDate}_To_${toDate}.xlsx`;
            Helper.downloadFile(response, fileName);
        });
    }

    private createQueryModel(filterModel: FilterModel): QueryModel {
        return this.queryModelService.createQueryModel(filterModel);
    }

    private createExcelQueryModel(title: string, filterModel: FilterModel): QueryModel {
        return this.queryModelService.createExcelQueryModel(title, filterModel);
    }
}
