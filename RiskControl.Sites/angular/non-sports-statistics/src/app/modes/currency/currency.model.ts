import { NormalQueryModel, HistoryQueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

interface DrillDownCurrencyModel {
    drillDownCurrency: number;
}

export interface CurrencyNormalQueryModel extends NormalQueryModel, DrillDownCurrencyModel { }

export interface CurrencyHistoryQueryModel extends HistoryQueryModel, DrillDownCurrencyModel { }

export type CurrencyQueryModel = CurrencyNormalQueryModel | CurrencyHistoryQueryModel;

export class CurrencyGridModel extends GridModel {
    readonly drillDownCurrency: number;

    constructor(isDrillDown: boolean, drillDownCurrency: number) {
        super(isDrillDown);
        this.drillDownCurrency = drillDownCurrency;
    }
}
