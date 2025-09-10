export interface GridModel {
    productId: number;
    productName: string;
    sportType: number;
    sportName: string;
    lastUpdated: Date;
    status: string;
}

export interface ApiResultModel {
    statusCode: number;
    errorCode: number;
    errorDescription: string;
}