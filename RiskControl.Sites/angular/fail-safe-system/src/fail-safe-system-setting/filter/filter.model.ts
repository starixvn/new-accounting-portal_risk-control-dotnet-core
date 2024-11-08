export interface RuleTitle {
    ruleId: number;
    ruleTitle: string;
}

export interface Product {
    productId: number;
    productName: string;
}

export interface SettingCriteria {
    productIdList: string;
    ruleIdList: string;
}
