import { RoleId } from '../../common/model';
import { QueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

interface UserNameCriteria {
    roleId: RoleId;
    custId: number;
}
export interface UserNameBaseQueryModel extends QueryModel, UserNameCriteria { }

export class UserNameGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDownCurrency: boolean, isDrillDownFromUserName = false) {
        super(isDrillDownCurrency);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}
