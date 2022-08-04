import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { Observable } from 'rxjs';
import { CommandResult } from '../common/model';
import { GameGroupSetting, GroupGroupSettingModel, RepresentativeBettypeModel, UnssignedBettypeModel } from './app.model';

@Injectable()
export class AppService {

  constructor(
    private httpService: HttpService
  ) { }

  queryRepresentativeBettype(productId: number): Observable<RepresentativeBettypeModel> {
    const url = 'api/win-limit-control/manage-setting-group/representative-bettype';
    return this.httpService.post<RepresentativeBettypeModel>(url, { productId: productId });
  }

  queryUnssignedBettypes(productId: number): Observable<UnssignedBettypeModel[]> {
    const url = 'api/win-limit-control/manage-setting-group/unassigned-bettype';
    return this.httpService.post<UnssignedBettypeModel[]>(url, { productId: productId });
  }

  queryGroupSettings(productId: number): Observable<GroupGroupSettingModel[]> {
    const url = 'api/win-limit-control/manage-setting-group/group-setting';
    return this.httpService.post<GroupGroupSettingModel[]>(url, { productId: productId });
  }

  initialSettings(setting: GameGroupSetting[]): Observable<CommandResult> {
    const url = 'state-api/win-limit-control/manage-setting-group/initialize-settings';
    return this.httpService.post<CommandResult>(url, { Settings: setting });
  }
}
