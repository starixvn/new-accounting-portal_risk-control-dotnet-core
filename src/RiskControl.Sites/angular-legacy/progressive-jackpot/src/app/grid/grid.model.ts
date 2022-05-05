export interface Record {
  GameGroupNameAlias: string;
  GameTypeNameAlias: string;
  JackpotTypeNameAlias: string;
  PlayerCount: number;
  BetCount: number;
  TotalBet: number;
}

export interface RealTimeRecord extends Record {
  JackpotStartDate: string;
  CurrentRefundPool: number;
  CurrentReservePool: number;
  CurrentJackpotPool: number;
  PJMainId: number;
  Level: number;
}

export interface WinnerRecord {
  GameGroupNameAlias: string;
  GameTypeNameAlias: string;
  JackpotTypeNameAlias: string;
  JackpotStartDate: string;
  JackpotHitDate: string;
  UserName: string;
  WinningAmt: number;
}

export interface MonthlyQueryModel {
  PJMainId: number;
  Level: number;
}

export interface MonthlyRecord extends Record {
  Month: string;
}

export interface DailyQueryModel extends MonthlyQueryModel {
  Month: string;
}

export interface DailyRecord extends Record {
  Date: string;
}

export enum GridType {
  None,
  RealTime,
  Monthly,
  Daily,
  Winner
}
