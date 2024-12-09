import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { AddRuleCriteria, EditRuleCriteria } from './rule.model';
import { Observable } from 'rxjs';
import { CommonConstants } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(private readonly httpService: HttpService) { }

  addRule(criteria: AddRuleCriteria): Observable<boolean> {
    return this.httpService.post(`${CommonConstants.API}setting/add-rule`, criteria);
  }

  editRule(criteria: EditRuleCriteria): Observable<boolean> {
    return this.httpService.post(`${CommonConstants.API}setting/edit-rule`, criteria);
  }
}
