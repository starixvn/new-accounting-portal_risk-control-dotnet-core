import { RoleId } from '../../common/model';
import { BaseQueryModel } from '../../app.model';
import { GridModel } from '../mode.model';

interface UserNameCriteria {
    roleId: RoleId;
    custId: number;
}
export interface UserNameBaseQueryModel extends BaseQueryModel, UserNameCriteria { }

export function isNormalQueryModel(queryModel: UserNameBaseQueryModel): queryModel is UserNameBaseQueryModel {
    return queryModel.isNormalMode;
}

export class UserNameGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDownCurrency: boolean, isDrillDownFromUserName = false) {
        super(isDrillDownCurrency);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}
