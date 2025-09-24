import { GridModel } from '../mode.model';
import { QueryModel } from '../../app.model';

export class HourlyGridModel extends GridModel {
    readonly isDrillDownFromUserName: boolean;

    constructor(isDrillDown: boolean, isDrillDownFromUserName = false) {
        super(isDrillDown);
        this.isDrillDownFromUserName = isDrillDownFromUserName;
    }
}

export interface HourlyData {
    hourlyStatisticAccumulated: HourlyStatisticAccumulatedData;
    hourlyStatistics: HourlyStatistics[];
}

export interface HourlyStatisticAccumulatedData {
    hourlyStatistics: HourlyStatistics[];
    averagePlayer: number;
}

export interface HourlyStatistics {
    reportBy: string;
    noOfPlayers: number;
    betCount: number;
    currency: string;
    totalBets: number;
    totalWins: number;
    gameIncome: number;
    gamePayout: number;
    houseTurnover: number;
    houseGrossIncome: number;
    houseComm: number;
    houseNetIncome: number;
    extraPT: number;
}

export interface HourlyQueryModel extends QueryModel {}
