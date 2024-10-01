import { Injectable } from '@angular/core';
import { QueryModel } from 'app/app.model';
import { HttpService } from 'nap-components/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeadlineService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  query(model: QueryModel): Observable<GridOptions> {
      const url = 'HeadlineNonSportsGamesStatistics/Query';
      return this.httpService.post<GridOptions>(url, model);
  }

  excel(model: QueryModel): Observable<Blob> {
      const url = 'HeadlineNonSportsGamesStatistics/Excel';
      return this.httpService.download(url, model);
  }
}
