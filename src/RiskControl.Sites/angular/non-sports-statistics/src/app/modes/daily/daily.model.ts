import { NormalQueryModel, HistoryQueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

interface DrillDownUserNameModel {
    usernameDrillDown: boolean;
}

export interface DailyNormalQueryModel extends NormalQueryModel, DrillDownUserNameModel { }

export interface DailyHistoryQueryModel extends HistoryQueryModel, DrillDownUserNameModel { }

export type DailyQueryModel = DailyNormalQueryModel | DailyHistoryQueryModel;

export class DailyGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDown: boolean, isDrillDownFromUserName = false) {
        super(isDrillDown);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}
