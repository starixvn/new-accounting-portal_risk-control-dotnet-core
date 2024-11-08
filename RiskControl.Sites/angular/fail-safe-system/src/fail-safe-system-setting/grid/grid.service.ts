import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { Observable } from 'rxjs';
import { GridModel } from './grid.model';
import { CommonConstants } from '../../common/constants';
import { SettingCriteria } from '../filter/filter.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private readonly httpService: HttpService) { }

  getSettings(criteria: SettingCriteria): Observable<GridModel[]> {
    return this.httpService.post(`${CommonConstants.API}setting/data`, criteria);
  }
}
