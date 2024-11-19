import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { Observable } from 'rxjs';
import { CommonConstants } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private readonly httpService: HttpService) { }

  public getHostPermission(): Observable<boolean> {
    return this.httpService.post(`${CommonConstants.API}host-permission`);
  }
}
