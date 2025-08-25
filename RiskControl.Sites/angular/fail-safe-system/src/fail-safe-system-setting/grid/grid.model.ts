export interface GridModel {
    constantKey: number;
    ruleTitle: string;
    productCount: number;
    ruleMemberLimit: number;
    enableLetstalk: boolean;
    autoDisableProduct: boolean;
    gameIncome: string;
    gamePayout: string;
    productList: string[];
    isDelete: boolean;
    isTest: boolean;
}

export interface DeleteRuleCriteria {
    constantKeyList: string;
}
