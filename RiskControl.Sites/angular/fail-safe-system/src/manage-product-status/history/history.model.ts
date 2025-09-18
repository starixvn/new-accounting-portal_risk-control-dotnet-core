export interface HistoryModel {
    insertDate: Date;
    actionType: string;
    proceededBy: string;
    isSuccess: boolean;
    description: string;
}

export interface HistoryCriteria {
    productId: number;
    sportType: number;
}
