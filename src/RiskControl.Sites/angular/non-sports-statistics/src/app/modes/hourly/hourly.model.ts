import { GridModel } from '../mode.model';
import { NormalQueryModel, HistoryQueryModel } from '../../app.model';

export class HourlyGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDown: boolean, isDrillDownFromUserName = false) {
        super(isDrillDown);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}

export interface HourlyData {
    HourlyStatisticAccumulated: HourlyStatisticAccumulatedData;
    HourlyStatistics: HourlyStatistics[];
}

export interface HourlyStatisticAccumulatedData {
    HourlyStatistics: HourlyStatistics[];
    AveragePlayer: number;
}

export interface HourlyStatistics {
    ReportBy: string;
    NoOfPlayers: number;
    BetCount: number;
    Currency: string;
    TotalBets: number;
    TotalWins: number;
    GameIncome: number;
    GamePayout: number;
    HouseTurnover: number;
    RealTurnover: number;
    HouseGrossIncome: number;
    HouseComm: number;
    HouseNetIncome: number;
    ExtraPT: number;
}

export interface HourlyNormalQueryModel extends NormalQueryModel { usernameDrillDown: boolean; }

export interface HourlyHistoryQueryModel extends HistoryQueryModel { usernameDrillDown: boolean;}

export type HourlyQueryModel = HourlyNormalQueryModel | HourlyHistoryQueryModel;
