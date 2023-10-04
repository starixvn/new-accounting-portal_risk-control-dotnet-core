export interface GameGroup {
  gameGroupId: number;
  gameGroupNameAlias: string;
}

export interface GameType {
  gameTypeId: number;
  gameTypeNo: string;
  gameTypeNameAlias: string;
}

export interface JackpotType {
  jackpotTypeId: number;
  jackpotTypeNameAlias: string;
  gameTypeId: number;
  gameGroupId: number;
}

export enum SearchType {
  RealTime,
  Winner
}

export interface FilterModel {
  gameGroupId: number;
  gameTypeId: number;
  jackpotTypeId: number;
  searchType: SearchType;
}
