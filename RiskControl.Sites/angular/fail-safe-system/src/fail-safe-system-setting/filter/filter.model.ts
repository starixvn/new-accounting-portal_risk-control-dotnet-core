export interface RuleTitle {
    ruleId: number;
    ruleTitle: string;
}

export interface Product {
    productId: number;
    productName: string;
    checked: boolean;
}

export interface SettingCriteria {
    productIdList: string;
    ruleIdList: string;
}
