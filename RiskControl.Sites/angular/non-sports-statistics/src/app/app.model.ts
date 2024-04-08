interface BalanceUpRange {
    balanceUpDay: string;
    moveBetsDay: string;
}

export interface BalanceUpModel {
    today: string;
    balanceUpRange: BalanceUpRange;
}

export interface BaseQueryModel {
    productId: string;
    username: string;
    site: string;
    betType: string;
    leagueId: string;
    sportType: string;
    currency: string;
    device: string;
    excludeTest: boolean;
    viewByInteger: boolean;
    totalBetType: number;
    totalBetValue: number;
    gameIncomeType: number;
    gameIncomeValue: number;
    removalColumns: string[];
    sortDirection: string;
    sortColumnName: string;
    reportBy: string;
    title: string;
    isDrillDown: boolean;
    isGrandTotal: boolean;
    isNormalMode: boolean;
    isBaseRM: boolean;
    sportBettype: string;
    isExactly: boolean;
    housePTType: number;
    housePTValue: number;
    fromDate: string;
    toDate: string;
}
