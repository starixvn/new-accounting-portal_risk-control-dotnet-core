export interface RuleTitle {
    constantKey: number;
    ruleTitle: string;
    checked: boolean;
}

export interface Product {
    productId: number;
    productName: string;
    checked: boolean;
}

export interface SettingCriteria {
    productIdList: string;
    constantKeyList: string;
}
