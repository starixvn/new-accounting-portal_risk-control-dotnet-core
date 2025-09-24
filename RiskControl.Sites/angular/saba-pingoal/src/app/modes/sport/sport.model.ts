import { QueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

export interface SportQueryModel extends QueryModel {
    isDrillDownSport: boolean,
    isDrillDownLeague: boolean
 }

export class SportGridModel extends GridModel {
    readonly isDrillDownSport: boolean;
    readonly isDrillDownLeague: boolean;

    constructor(isDrillDown: boolean, isDrillDownSport = false, isDrillDownLeague = false) {
        super(isDrillDown);
        this.isDrillDownSport = isDrillDownSport;
        this.isDrillDownLeague = isDrillDownLeague;
    }
}

