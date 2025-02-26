export interface MonitorModel {
    custId: number;
    userName: string;
    siteId: number;
    siteName: string;
    currencyId: number;
    currencyName: string;
    productId: number;
    productName: string;
    groupId: number;
    groupName: string;
    winningAmount: number;
    winningAmountRM: number;
    reachedLimitTime: string;
    reachedLimitLevel: number;
    isSuspendedAccount: boolean;
    numberReachedLimit: number;
    isNotified: boolean;
    isBlockedPlaceBet: boolean;
    isBlockedTransfer: boolean;
    isEnableUnblock: boolean;
    blackLimit: number;
    greyLimit: number;
    yellowLimit: number;
    orangeLimit: number;
    redLimit: number;
}

export interface UnblockCommand {
    custId: number;
    productId: number;
    groupId: number;
}

export interface WinLossAnalysisExcel {
    custId: number;
    productId: number;
    reachedLimitTime: string;
    username: string;
}

export interface ApiResultModel {
    fileName: string;
    invalidUsernames: string;
    guid: string;
}

export interface QueryModel {
    fromDate: string;
    toDate: string;
    productId: number;
    levelId: string;
    userName: string;
    multiSite: string;
    currencyId: number;
    excludeTestData: boolean;
}
