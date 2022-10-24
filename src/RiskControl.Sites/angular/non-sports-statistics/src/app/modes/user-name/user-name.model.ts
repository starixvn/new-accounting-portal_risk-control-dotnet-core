import { RoleId } from '../../common/model';
import { BaseQueryModel, NormalCriteria, HistoryCriteria } from '../../app.model';
import { GridModel } from '../mode.model';

interface UserNameCriteria {
    roleId: RoleId;
    custId: number;
}
export interface UserNameBaseQueryModel extends BaseQueryModel, UserNameCriteria { }

export interface UserNameNormalQueryModel extends UserNameBaseQueryModel, NormalCriteria { }

export interface UserNameHistoryQueryModel extends UserNameBaseQueryModel, HistoryCriteria { }

export type UserNameQueryModel = UserNameNormalQueryModel | UserNameHistoryQueryModel;

export function isNormalQueryModel(queryModel: UserNameQueryModel): queryModel is UserNameNormalQueryModel {
    return queryModel.isNormalMode;
}

export class UserNameGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDownCurrency: boolean, isDrillDownFromUserName = false) {
        super(isDrillDownCurrency);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}
