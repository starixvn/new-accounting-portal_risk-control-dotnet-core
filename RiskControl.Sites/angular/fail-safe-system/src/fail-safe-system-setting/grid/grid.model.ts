export interface GridModel {
    constantKey: number;
    ruleTitle: string;
    productCount: number;
    ruleMemberLimit: number;
    enableLetstalk: boolean;
    gameIncome: string;
    gamePayout: string;
    productList: string[];
    isDelete: boolean;
}

export interface DeleteRuleCriteria {
    constantKeyList: string;
}
