import { RoleId } from '../../common';
import { QueryModel } from '../../app.model';
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

export interface Top20BaseQueryModel extends QueryModel, Top20Criteria { }

export class Top20GridModel extends UserNameGridModel {
    readonly topType: TopType;

    constructor(isDrillDownCurrency: boolean, isDrillDownFromUserName: boolean, topType = TopType.All) {
        super(isDrillDownCurrency, isDrillDownFromUserName);
        this.topType = topType;
    }
}
