import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { Product, RuleTitle } from './filter.model';
import { Observable } from 'rxjs';
import { CommonConstants } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private readonly httpService: HttpService)
  { }

  public getRuleTitles(): Observable<RuleTitle[]> {
    return this.httpService.post(`${CommonConstants.API}setting/rule-title`);
  }

  public getProducts(): Observable<Product[]> {
    return this.httpService.post(`${CommonConstants.API}setting/product`);
  }
}
