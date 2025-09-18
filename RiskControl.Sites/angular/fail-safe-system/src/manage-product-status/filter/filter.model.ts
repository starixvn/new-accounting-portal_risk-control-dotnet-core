export interface Product {
    productId: number;
    productName: string;
    checked: boolean;
}

export interface ManageProductStatusCriteria {
    productIds: string;
}