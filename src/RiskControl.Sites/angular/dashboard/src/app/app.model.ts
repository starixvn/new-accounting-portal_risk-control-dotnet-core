export interface WeeklyNetIncome {
    week: string;
    creditNetIncome: number;
    depositNetIncome: number;
    netIncome: number;
}

export interface TotalPlayersByDevice {
    weekly: string;
    mobilePlayers: number;
    nonMobilePlayers: number;
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
