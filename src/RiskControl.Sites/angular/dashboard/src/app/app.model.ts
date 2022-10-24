export interface CurrencyNetIncome {
    currency: string;
    netIncome: number;
}

export interface MonthlyTurnoverAndNetIncome {
    month: string;
    turnover: number;
    netIncome: number;
}

export interface ProductTurnover {
    product: string;
    turnover: number;
}

export interface TopGameTypeWinning {
    bettype: string;
    product: string;
    gameIncome: number;
}

export interface TopMemberWinning {
    username: string;
    currency: string;
    gameIncome: number;
}

export interface WinLossLimit {
    userName: string;
    currency: string;
    product: string;
    limitLevel: number;
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
