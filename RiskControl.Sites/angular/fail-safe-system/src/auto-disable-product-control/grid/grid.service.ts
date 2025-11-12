import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { Observable } from 'rxjs';
import { AutoDisableProductModel } from './grid.model';
import { CommonConstants } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  constructor(private readonly httpService: HttpService) { }

  getData(): Observable<AutoDisableProductModel[]> {
    return this.httpService.post(`${CommonConstants.API}auto-disable-product/view-logs`, {});
  }
}
