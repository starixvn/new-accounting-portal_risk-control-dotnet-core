import { Injectable } from '@angular/core';
import { HttpService } from 'nap-components/http';
import { SavedFilterQueryModel } from '../filter.model';
import { Observable, of } from 'rxjs';
import { SavedFilterGridModel } from 'components/saved-filter-grid/saved-filter-grid.model';

@Injectable({
  providedIn: 'root'
})
export class SavedFilterService {

  private readonly url = 'NonSportsGamesStatistics/SavedFilter';

  constructor(private readonly httpService: HttpService) { }

  executeFilter(model: SavedFilterQueryModel){
    return this.httpService.post(`${this.url}/Execute`, model);
  }

  queryFilters(model: SavedFilterQueryModel, noSpinner: boolean): Observable<SavedFilterGridModel[]> {
    return this.httpService.post(`${this.url}/Query`, model, {
      noSpinner: noSpinner
    });
  }
}
