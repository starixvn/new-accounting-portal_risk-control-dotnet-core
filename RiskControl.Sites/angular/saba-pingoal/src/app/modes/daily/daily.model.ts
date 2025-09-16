import { QueryModel } from 'app/app.model';
import { GridModel } from '../mode.model';

export interface DailyQueryModel extends QueryModel { }

export class DailyGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDown: boolean, isDrillDownFromUserName = false) {
        super(isDrillDown);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}

