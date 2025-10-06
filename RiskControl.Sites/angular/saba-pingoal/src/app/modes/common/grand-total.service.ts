import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ApiConstants } from '../../common/constants';

@Injectable()
export class GrandTotalService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  query(endPoint: string, model: any): Observable<GridOptions> {
    return this.httpService.post<GridOptions>(`${ApiConstants.REPORT}${endPoint}`, model);
  }

  excel(endPoint: string, model: any): Observable<Blob> {
    return this.httpService.download(`${ApiConstants.REPORT}${endPoint}`, model);
  }
}
