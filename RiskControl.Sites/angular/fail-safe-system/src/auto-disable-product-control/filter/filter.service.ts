import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { AutoDisableProductCriteria } from './filter.model';
import { Observable } from 'rxjs';
import { CommonConstants } from '../../common/constants';
import { AutoDisableProductModel } from '../grid/grid.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private readonly httpService: HttpService)
  { }

  public save(criteria: AutoDisableProductCriteria): Observable<boolean> {
    return this.httpService.post(`${CommonConstants.API}auto-disable-product/save`, criteria);
  }

  public getCurrentStatus(): Observable<AutoDisableProductModel> {
    return this.httpService.post(`${CommonConstants.API}auto-disable-product/current-status`, { });
  }

  getData(): Observable<AutoDisableProductModel[]> {
    return this.httpService.post(`${CommonConstants.API}auto-disable-product/view-logs`, {});
  }
}
