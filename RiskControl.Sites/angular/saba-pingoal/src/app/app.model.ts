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
    sportBettype: string;
    userName: string;
    excludeTest: boolean;
    site: string;
    leagueGroup: string;
    currency: string;
    device: string;
    isDrillDown: boolean;
    userNameDrillDown: boolean;
    isGrandTotal: boolean;
    isExactly: boolean;
    sortDirection: string;
    sortColumnName: string;
    reportBy: number;
    title: string;
    headerText: string;
    removalColumns: string[];
}
