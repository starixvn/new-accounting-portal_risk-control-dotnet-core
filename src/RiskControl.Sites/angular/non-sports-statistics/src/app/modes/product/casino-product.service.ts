import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { CasinoProductQueryModel } from './product.model';

@Injectable()
export class CasinoProductService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  query(model: CasinoProductQueryModel): Observable<GridOptions> {
    const url = this.getUrl(model) + 'Query';
    return this.httpService.post<GridOptions>(url, model);
  }

  excel(model: CasinoProductQueryModel): Observable<Blob> {
    const url = this.getUrl(model) + 'Excel';
    return this.httpService.download(url, model);
  }

  queryGrandTotal(model: CasinoProductQueryModel): Observable<GridOptions> {
    const url = this.getUrl(model, true) + 'Query';
    return this.httpService.post<GridOptions>(url, model);
  }

  excelGrandTotal(model: CasinoProductQueryModel): Observable<Blob> {
    const url = this.getUrl(model, true) + 'Excel';
    return this.httpService.download(url, model);
  }

  private getUrl(model: CasinoProductQueryModel, isGrandTotal = false): string {
    if (!isGrandTotal) {
      if (model.reportBy === 'SpecificMemberProductSubProduct') {
        return 'NonSportsGamesStatistics/SpecificMember/CasinoProduct/';
      }

      return model.isNormalMode
        ? 'NonSportsGamesStatistics/ProductNormal/'
        : 'NonSportsGamesStatistics/ProductHistory/';
    } else {
      if (model.reportBy === 'SpecificMemberProductSubProduct') {
        return 'NonSportsGamesStatistics/SpecificMember/CasinoProductGrandTotal/';
      }

      return model.isNormalMode
        ? 'NonSportsGamesStatistics/ProductGrandTotalNormal/'
        : 'NonSportsGamesStatistics/ProductGrandTotalHistory/';
    }
  }
}
