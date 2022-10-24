import * as moment from 'moment';
import { Helper } from 'nap-components/helper';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'nap-components/http';
import { Injectable } from '@angular/core';
import { FilterModel } from '../filter/filter.model';
import { MonitorModel } from './grid.model';
import { DateHelper } from 'nap-components/date';

@Injectable()
export class GridService {
  constructor(private readonly httpService: HttpService) {}

  query(filterModel: FilterModel): Observable<MonitorModel[]> {
    const url = 'api/game-ground-bet-limit/monitor';
    const queryModel = this.createQueryModel(filterModel);
    return this.httpService.post<MonitorModel[]>(url, queryModel);
  }

  exportExcel(filterModel: FilterModel) {
    const url = 'api/game-ground-bet-limit/monitor-excel';
    const fromDate = moment(filterModel.fromDate).format('MMM_DD_YYYY');
    const toDate = moment(filterModel.toDate).format('MMM_DD_YYYY');
    const queryModel = this.createQueryModel(filterModel);
    this.httpService.download(url, queryModel).subscribe(response => {
      const fileName = `Game_Round_Bet_Limit_Monitor_From_${fromDate}_To_${toDate}.xlsx`;
      Helper.downloadFile(response, fileName);
    });
  }

  private createQueryModel(filterModel: FilterModel): object {
    return {
      fromDate: DateHelper.convertDateStructToString(filterModel.fromDate),
      toDate: DateHelper.convertDateStructToString(filterModel.toDate),
      productId: filterModel.productIds,
      betType: filterModel.gameTypes,
      excludeTestData: filterModel.excludeTestData
    };
  }
}
