export interface RuleTitle {
    constantKey: number;
    ruleTitle: string;
}

export interface Product {
    productId: number;
    productName: string;
    checked: boolean;
}

export interface MonitorCriteria {
    fromDate: string;
    toDate: string;
    productIdList: string;
    constantKeyList: string;
}