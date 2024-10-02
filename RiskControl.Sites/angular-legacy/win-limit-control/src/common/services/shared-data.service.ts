import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private popupData$ = new BehaviorSubject<boolean>(false);
  clickedPopup$ = this.popupData$.asObservable();

  constructor() { }

  setPopupData(data: boolean) {
    this.popupData$.next(data);
  }
}
