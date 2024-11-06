import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from 'nap-components/http';
import { GameType, ProductGameType } from './filter.model';

@Injectable()
export class FilterService {
  constructor(private readonly httpService: HttpService) {}

  queryGameTypes(): Observable<GameType[]> {
    const url = 'NonSportsGamesStatistics/GameType/Query';
    return this.httpService.get<GameType[]>(url);
  }

  queryProductGameTypes(): Observable<ProductGameType[]> {
    const url = 'api/game-ground-bet-limit/product-game-type';
    return this.httpService.get<ProductGameType[]>(url);
  }
}
