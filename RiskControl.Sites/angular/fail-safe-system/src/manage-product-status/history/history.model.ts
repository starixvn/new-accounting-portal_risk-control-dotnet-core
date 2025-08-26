export interface HistoryModel {
    date: Date;
    productName: string;
    status: string;
    proceededBy: string;
}

export interface HistoryCriteria {
    productId: number;
}
