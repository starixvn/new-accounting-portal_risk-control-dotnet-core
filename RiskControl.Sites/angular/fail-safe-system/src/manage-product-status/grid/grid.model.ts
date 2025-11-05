export interface GridModel {
    productId: number;
    productName: string;
    sportType: number;
    sportName: string;
    lastUpdated: Date;
    status: string;
    umStatus: string;
}

export interface GroupedGridModel {
    productId: number;
    status: string;
    items: GridModel[];
}

export interface ApiResultModel {
    statusCode: number;
    errorCode: number;
    errorDescription: string;
}