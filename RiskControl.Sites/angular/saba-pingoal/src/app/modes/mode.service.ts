import { Injectable, Type } from '@angular/core';
import { ModeGenerate } from './mode.model';
import * as _ from 'lodash';
import { DailyComponent } from './daily';

@Injectable()
export class ModeService {
  getComponent(): Type<ModeGenerate> {
    return DailyComponent
  }
}
