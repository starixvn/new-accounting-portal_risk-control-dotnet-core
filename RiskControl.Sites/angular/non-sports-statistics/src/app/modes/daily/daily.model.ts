import { BaseQueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

interface DrillDownUserNameModel {
    usernameDrillDown: boolean;
}

export interface DailyQueryModel extends BaseQueryModel, DrillDownUserNameModel { }

export class DailyGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDown: boolean, isDrillDownFromUserName = false) {
        super(isDrillDown);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}

