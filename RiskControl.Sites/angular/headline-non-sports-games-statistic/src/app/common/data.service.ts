import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private filterData$ = new BehaviorSubject<string>('');
  selectedFilterData$ = this.filterData$.asObservable();

  constructor() { }

  setFilterData(filter: string) {
    this.filterData$.next(filter);
  }
}
