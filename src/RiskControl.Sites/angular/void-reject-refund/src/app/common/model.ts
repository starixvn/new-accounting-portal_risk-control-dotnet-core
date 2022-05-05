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
    GroupName: string;
    ReportBy: string;
    Currency: string;
    NoOfPlayers: number;
    BetCount: number;
    Reject: number;
    Void: number;
    Refund: number;
    RejectPecentage: number;
    VoidPecentage: number;
    RefundPecentage: number;
}

export interface ChildGroupStatisticModel {
    GroupName: string;
    Statistics: StatisticModel[];
}

export interface StatisticReportModel {
    Statistics: StatisticModel[];
    GrandTotal: StatisticModel;

}

export interface GroupStatisticModel {
    Total: StatisticModel;
    Statistics: ChildGroupStatisticModel[];
}

export interface GroupStatisticReportModel {
    Statistics: GroupStatisticModel[];
    GrandTotal: StatisticModel;
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

