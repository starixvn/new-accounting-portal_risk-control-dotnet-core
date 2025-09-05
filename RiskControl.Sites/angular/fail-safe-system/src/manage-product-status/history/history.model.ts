export interface HistoryModel {
    insertDate: Date;
    actionType: string;
    proceededBy: string;
    description: string;
}

export interface HistoryCriteria {
    productId: number;
    sportType: number;
}
