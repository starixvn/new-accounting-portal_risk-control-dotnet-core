import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { MonitorCriteria } from '../filter/filter.model';
import { Observable } from 'rxjs';
import { GridModel } from './grid.model';
import { CommonConstants } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  constructor(private readonly httpService: HttpService) { }

  getMonitors(criteria: MonitorCriteria): Observable<GridModel[]> {
    return this.httpService.post(`${CommonConstants.API}monitor/data`, criteria);
  }
}
