export interface MonitorModel {
    index: number;
    productName: string;
    betTypeName: string;
    gameRound: string;
    gameRoundBetLimit: number;
    betCount: number;
    noOfPlayers: number;
    totalStake: number;
    reachedLimitTime: Date;
}
