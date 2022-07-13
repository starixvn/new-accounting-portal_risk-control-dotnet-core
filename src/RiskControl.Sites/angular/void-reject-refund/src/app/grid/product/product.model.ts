export interface ProductLeagueSportBettypeStatistic {
    productId: number;
    productName: string;
    leagueSportBettypeId: number;
    leagueSportBettypeName: string;
    noOfPlayers: number;
    bettypeName: string;
    betCount: number;
    reject: number;
    void: number;
    refund: number;
    rejectPecentage: number;
    voidPecentage: number;
    refundPecentage: number;
}

export interface LeagueSportBettypeStatistic {
    total: ProductLeagueSportBettypeStatistic;
    bettypes: ProductLeagueSportBettypeStatistic[];
}

export interface ProductStatistic {
    isCollapse: boolean;
    total: ProductLeagueSportBettypeStatistic;
    leagueSportBettypes: LeagueSportBettypeStatistic[];
}

export interface ProductModel {
    productStatistics: ProductStatistic[];
    grandTotal: ProductLeagueSportBettypeStatistic;
}
