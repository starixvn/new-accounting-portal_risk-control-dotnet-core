
import { Injectable } from '@angular/core';
import { FilterModel } from '../filter/filter.model';
import { Grid } from '../common/model';

@Injectable()
export class GridService {
    filterModel: FilterModel;
    generate: (filterModel: FilterModel) => void;
}
