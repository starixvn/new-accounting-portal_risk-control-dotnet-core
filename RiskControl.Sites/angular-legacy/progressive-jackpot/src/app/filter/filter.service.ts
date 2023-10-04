
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, HttpOptions, DefaultHttpOptions } from 'nap-components/http';
import { FilterModel, GameType, JackpotType, GameGroup } from './filter.model';

@Injectable()
export class FilterService {
  constructor(
    private httpService: HttpService
  ) { }

  getGameGroups(): Observable<GameGroup[]> {
    const allGameGroup: GameGroup = {
      gameGroupId: 0,
      gameGroupNameAlias: 'All'
    };
    const url = 'api/progressive-jackpot/game-group';
    return this.httpService.post<GameGroup[]>(url).pipe(map(result => {
      result.unshift(allGameGroup);
      return result;
    }));
  }

  getGameTypes(gameGroupId: number): Observable<GameType[]> {
    const allGameType: GameType = {
      gameTypeId: 0,
      gameTypeNo: 'All',
      gameTypeNameAlias: 'All'
    };
    const url = 'api/progressive-jackpot/game-type';
    const data = {
      gameGroupId: gameGroupId
    };
    return this.httpService.post<GameType[]>(url, data).pipe(map(result => {
      result.unshift(allGameType);
      return result;
    }));
  }

  getJackpotTypes(gameGroupId: number, gameTypeId: number): Observable<JackpotType[]> {
    const allJackpotType: JackpotType = {
      jackpotTypeId: 0,
      jackpotTypeNameAlias: 'All',
      gameTypeId: 0,
      gameGroupId: 0
    };
    const url = 'api/progressive-jackpot/jackpot-type';
    const data = {
      gameGroupId: gameGroupId,
      gameTypeId: gameTypeId
    };
    return this.httpService.post<JackpotType[]>(url, data).pipe(map(result => {
      result.unshift(allJackpotType);
      return result;
    }));
  }
}
