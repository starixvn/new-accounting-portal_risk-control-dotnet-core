export interface CurrencyNetIncome {
    Currency: string;
    NetIncome: number;
}

export interface MonthlyTurnoverAndNetIncome {
    Month: string;
    Turnover: number;
    NetIncome: number;
}

export interface ProductTurnover {
    Product: string;
    Turnover: number;
}

export interface TopGameTypeWinning {
    Bettype: string;
    Product: string;
    GameIncome: number;
}

export interface TopMemberWinning {
    Username: string;
    Currency: string;
    GameIncome: number;
}

export interface WinLossLimit {
    UserName: string;
    Currency: string;
    Product: string;
    LimitLevel: number;
}

interface BalanceUpRange {
    balanceUpDay: string;
    moveBetsDay: string;
}

export interface BalanceUpModel {
    today: string;
    balanceUpRange: BalanceUpRange;
}

export interface ChartColor {
  backgroundColor: string[];
}

export interface ChartDataSet {
  label: string;
  data: number[];
}
