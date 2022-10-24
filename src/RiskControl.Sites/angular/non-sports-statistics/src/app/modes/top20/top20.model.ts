import { RoleId } from '../../common';
import { BaseQueryModel, NormalQueryModel, NormalCriteria, HistoryQueryModel, HistoryCriteria } from '../../app.model';
import { UserNameGridModel } from '../user-name';

export enum TopType {
    All = 0,
    Winner = 1,
    Loser = 2
}

interface Top20Criteria {
    topType: TopType;
    roleId: RoleId;
    custId: number;
}

export interface Top20BaseQueryModel extends BaseQueryModel, Top20Criteria { }

export interface Top20NormalQueryModel extends Top20BaseQueryModel, NormalCriteria { }

export interface Top20HistoryQueryModel extends Top20BaseQueryModel, HistoryCriteria { }

export type Top20QueryModel = Top20NormalQueryModel | Top20HistoryQueryModel;

export class Top20GridModel extends UserNameGridModel {
    readonly topType: TopType;

    constructor(isDrillDownCurrency: boolean, isDrillDownFromUserName: boolean, topType = TopType.All) {
        super(isDrillDownCurrency, isDrillDownFromUserName);
        this.topType = topType;
    }
}
