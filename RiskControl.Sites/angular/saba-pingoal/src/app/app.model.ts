interface BalanceUpRange {
    balanceUpDay: string;
    moveBetsDay: string;
}

export interface BalanceUpModel {
    today: string;
    balanceUpRange: BalanceUpRange;
}

export interface QueryModel {
    fromDate: string;
    toDate: string;
    productId: string;
    username: string;
    site: string;
    betType: string;
    leagueId: string;
    sportType: string;
    currency: string;
    device: string;
    excludeTest: boolean;
    removalColumns: string[];
    sortDirection: string;
    sortColumnName: string;
    title: string;
    isDrillDown: boolean;
    isGrandTotal: boolean;
    isBaseRM: boolean;
    sportBettype: string;
    isExactly: boolean;
    custId: number;
    headline: number;
    roleId: number;
    excludeNoData: boolean;
}
