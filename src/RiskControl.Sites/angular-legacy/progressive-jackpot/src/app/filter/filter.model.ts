export interface GameGroup {
  GameGroupId: number;
  GameGroupNameAlias: string;
}

export interface GameType {
  GameTypeId: number;
  GameTypeNo: string;
  GameTypeNameAlias: string;
}

export interface JackpotType {
  JackpotTypeId: number;
  JackpotTypeNameAlias: string;
  GameTypeId: number;
  GameGroupId: number;
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
