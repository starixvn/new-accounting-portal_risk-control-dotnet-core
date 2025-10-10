import { QueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

interface DrillDownCurrencyModel {
    drillDownCurrency: number;
}

export interface CurrencyQueryModel extends QueryModel, DrillDownCurrencyModel { }

export class CurrencyGridModel extends GridModel {
    readonly drillDownCurrency: number;

    constructor(isDrillDown: boolean, drillDownCurrency: number) {
        super(isDrillDown);
        this.drillDownCurrency = drillDownCurrency;
    }
}
