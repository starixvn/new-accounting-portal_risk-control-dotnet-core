import { Injectable, Type } from '@angular/core';
import { ReportType } from 'app/filter/filter.model';
import { ModeGenerate } from './mode.model';
import * as _ from 'lodash';
import { HeadlineComponent } from './headline/headline.component';

@Injectable()
export class ModeService {
  getComponent(): Type<ModeGenerate> {
    return HeadlineComponent
  }
}
