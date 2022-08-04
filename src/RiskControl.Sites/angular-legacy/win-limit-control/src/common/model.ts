export interface CommandResult {
    errorCode: number;
}

export interface HostPermission {
    playerWinLimitManagement: boolean;
    currencyWinLimitSetting: boolean;
    winLimitMonitor: boolean;
}