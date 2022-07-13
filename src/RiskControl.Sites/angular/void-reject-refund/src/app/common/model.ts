import { Observable } from 'rxjs';

export interface Grid {
    hasExcel: boolean;
    hasData: boolean;
    title: string;
    query(): Observable<object>;
    exportExcel(title: string): void;
}

export enum ProductId {
    NumberGame = 3,
    LiveCasino = 4,
    VirtualSports = 5,
    RNGCasino = 6,
    Keno = 8,
    FishingWorld = 24,
    Lucky3 = 26,
    VirtualSports2 = 27,
    KenoLottery = 28,
    Bullfighting = 30,
    PokerGames = 33,
    NG2 = 23,
    SabaClub = 42,
    VGaming = 66
}

export enum CasinoType {
    None = 0,
    RNG = 1,
    SLI = 2
}

export enum GameTypeId {
    SportType = 1,
    BetType = 2,
    League = 3,
    SabaClub = 200,
    SabaClubFreeBet = 150,
    VGaming = 171,
    VGamingFreeBet = 173
}

export interface StatisticModel {
    groupName: string;
    reportBy: string;
    currency: string;
    noOfPlayers: number;
    betCount: number;
    reject: number;
    void: number;
    refund: number;
    rejectPecentage: number;
    voidPecentage: number;
    refundPecentage: number;
}

export interface ChildGroupStatisticModel {
    groupName: string;
    statistics: StatisticModel[];
}

export interface StatisticReportModel {
    statistics: StatisticModel[];
    grandTotal: StatisticModel;

}

export interface GroupStatisticModel {
    total: StatisticModel;
    statistics: ChildGroupStatisticModel[];
}

export interface GroupStatisticReportModel {
    statistics: GroupStatisticModel[];
    grandTotal: StatisticModel;
}

export interface QueryModel {
    fromDate: string;
    toDate: string;
    productId: string;
    site: string;
    bettype: string;
    leagueId: string;
    sportType: string;
    currency: string;
    device: string;
    excludeTest: boolean;
    reportBy: number;
    sortColumnName: string;
    sortDirection: string;
    sportBettype: string;
}

export interface ExcelQueryModel extends QueryModel {
    title: string;
}

interface BalanceUpRange {
    balanceUpDay: string;
    moveBetsDay: string;
}

export interface BalanceUpModel {
    today: string;
    balanceUpRange: BalanceUpRange;
}

