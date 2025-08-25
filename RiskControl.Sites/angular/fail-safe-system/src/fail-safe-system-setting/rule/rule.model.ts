export interface AddRuleCriteria {
    ruleTitle: string;
    productIdList: string;
    ruleMemberLimit: number;
    enableLetstalk: boolean;
    criteriaList: string;
    isTest: boolean;
    autoDisableProduct: boolean;
}

export interface EditRuleCriteria extends AddRuleCriteria {
    constantKey: number;
}

export enum AlertType {
    Danger = 'alert-danger',
    Success = 'alert-success'
}
