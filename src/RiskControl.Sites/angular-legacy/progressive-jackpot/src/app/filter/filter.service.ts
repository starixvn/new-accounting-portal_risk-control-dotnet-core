import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService, HttpOptions, DefaultHttpOptions } from 'nap-components/http';
import { FilterModel, GameType, JackpotType, GameGroup } from './filter.model';

@Injectable()
export class FilterService {
  constructor(
    private httpService: HttpService
  ) { }

  getGameGroups(): Observable<GameGroup[]> {
    const allGameGroup: GameGroup = {
      GameGroupId: 0,
      GameGroupNameAlias: 'All'
    };
    const url = 'api/progressive-jackpot/game-group';
    return this.httpService.post<GameGroup[]>(url).map(result => {
      result.unshift(allGameGroup);
      return result;
    });
  }

  getGameTypes(gameGroupId: number): Observable<GameType[]> {
    const allGameType: GameType = {
      GameTypeId: 0,
      GameTypeNo: 'All',
      GameTypeNameAlias: 'All'
    };
    const url = 'api/progressive-jackpot/game-type';
    const data = {
      gameGroupId: gameGroupId
    };
    return this.httpService.post<GameType[]>(url, data).map(result => {
      result.unshift(allGameType);
      return result;
    });
  }

  getJackpotTypes(gameGroupId: number, gameTypeId: number): Observable<JackpotType[]> {
    const allJackpotType: JackpotType = {
      JackpotTypeId: 0,
      JackpotTypeNameAlias: 'All',
      GameTypeId: 0,
      GameGroupId: 0
    };
    const url = 'api/progressive-jackpot/jackpot-type';
    const data = {
      gameGroupId: gameGroupId,
      gameTypeId: gameTypeId
    };
    return this.httpService.post<JackpotType[]>(url, data).map(result => {
      result.unshift(allJackpotType);
      return result;
    });
  }
}
