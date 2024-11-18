import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RuleAction } from './constants';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private ruleData$ = new BehaviorSubject<RuleAction>(RuleAction.None);
  selectedRuleData$ = this.ruleData$.asObservable();

  setRuleData(ruleAction: number): void {
    this.ruleData$.next(ruleAction);
  }
}
