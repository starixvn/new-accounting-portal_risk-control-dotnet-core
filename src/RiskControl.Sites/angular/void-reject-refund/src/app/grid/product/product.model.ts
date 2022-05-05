export interface ProductLeagueSportBettypeStatistic {
    ProductId: number;
    ProductName: string;
    LeagueSportBettypeId: number;
    LeagueSportBettypeName: string;
    NoOfPlayers: number;
    BettypeName: string;
    BetCount: number;
    Reject: number;
    Void: number;
    Refund: number;
    RejectPecentage: number;
    VoidPecentage: number;
    RefundPecentage: number;
}

export interface LeagueSportBettypeStatistic {
    Total: ProductLeagueSportBettypeStatistic;
    Bettypes: ProductLeagueSportBettypeStatistic[];
}

export interface ProductStatistic {
    isCollapse: boolean;
    Total: ProductLeagueSportBettypeStatistic;
    LeagueSportBettypes: LeagueSportBettypeStatistic[];
}

export interface ProductModel {
    ProductStatistics: ProductStatistic[];
    GrandTotal: ProductLeagueSportBettypeStatistic;
}
