export interface Record {
  gameGroupNameAlias: string;
  gameTypeNameAlias: string;
  jackpotTypeNameAlias: string;
  playerCount: number;
  betCount: number;
  totalBet: number;
}

export interface RealTimeRecord extends Record {
  jackpotStartDate: string;
  currentRefundPool: number;
  currentReservePool: number;
  currentJackpotPool: number;
  pjMainId: number;
  level: number;
}

export interface WinnerRecord {
  gameGroupNameAlias: string;
  gameTypeNameAlias: string;
  jackpotTypeNameAlias: string;
  jackpotStartDate: string;
  jackpotHitDate: string;
  userName: string;
  winningAmt: number;
}

export interface MonthlyQueryModel {
  pjMainId: number;
  level: number;
}

export interface MonthlyRecord extends Record {
  month: string;
}

export interface DailyQueryModel extends MonthlyQueryModel {
  month: string;
}

export interface DailyRecord extends Record {
  date: string;
}

export enum GridType {
  None,
  RealTime,
  Monthly,
  Daily,
  Winner
}
