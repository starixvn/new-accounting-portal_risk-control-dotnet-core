import { Injectable } from '@angular/core';
import { ModeContext } from '../mode-context';
import { FilterConfig } from '../../filter/filter.config';

@Injectable()
export class GridService {
    constructor(
        private readonly modeContext: ModeContext
    ) { }

    isDrilldown(): boolean {
        const gridModel = this.modeContext.gridModel;
        return gridModel.isDrillDownCurrency;
    }

    hasCurrencyColumn(): boolean {
        const filterModel = this.modeContext.filterModel;
        return filterModel.removalColumns.indexOf(FilterConfig.gridColumns.currency.value) === -1;
    }

    hasDrillDownUserName() {
        const filterModel = this.modeContext.filterModel;
        return true;
    }

    hasDrillDownHourly(): boolean {
        return this.modeContext.filterModel.currency === '-1';
    }
}
