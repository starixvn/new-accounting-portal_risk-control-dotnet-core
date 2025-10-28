import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { ManageProductStatusCriteria } from '../filter/filter.model';
import { Observable } from 'rxjs';
import { ApiResultModel, GroupedGridModel } from './grid.model';
import { CommonConstants } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private readonly httpService: HttpService) { }

  getData(criteria: ManageProductStatusCriteria): Observable<GroupedGridModel[]> {
    return this.httpService.post(`${CommonConstants.API}manage-product-status/data`, criteria);
  }

  enableSport(sport: number, productId: number): Observable<ApiResultModel> {
    return this.httpService.post(`${CommonConstants.API}manage-product-status/enable-sport`, { sportType: sport, productId: productId });
  }

  public getHostPermission(): Observable<boolean> {
    return this.httpService.post(`${CommonConstants.API}host-permission`);
  }
}
