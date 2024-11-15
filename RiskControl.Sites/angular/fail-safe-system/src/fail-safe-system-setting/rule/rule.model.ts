export interface AddRuleCriteria {
    ruleTitle: string;
    productIdList: string;
    ruleMemberLimit: number;
    enableLetstalk: boolean;
    criteriaList: string;
}

export interface EditRuleCriteria extends AddRuleCriteria {
    ruleId: number;
}
