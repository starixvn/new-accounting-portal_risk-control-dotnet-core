import { QueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

export interface ProductQueryModel extends QueryModel {
    isDrillDownSport: boolean
 }

export class ProductGridModel extends GridModel {
    readonly isDrillDownSport: boolean;
    
    constructor(isDrillDown: boolean, isDrillDownSport = false) {
        super(isDrillDown);
        this.isDrillDownSport = isDrillDownSport;
    }
}

