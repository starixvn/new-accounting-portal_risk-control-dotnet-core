export interface MonitorModel {
    CustId: number;
    UserName: string;
    SiteId: number;
    SiteName: string;
    CurrencyId: number;
    CurrencyName: string;
    ProductId: number;
    ProductName: string;
    GroupId: number;
    GroupName: string;
    WinningAmount: number;
    WinningAmountRM: number;
    ReachedLimitTime: string;
    ReachedLimitLevel: number;
    NumberReachedLimit: number;
    IsNotified: boolean;
    IsBlockedPlaceBet: boolean;
    IsBlockedTransfer: boolean;
    IsEnableUnblock: boolean;
    BlackLimit: number;
    GreyLimit: number;
    YellowLimit: number;
    OrangeLimit: number;
    RedLimit: number;
}

export interface UnblockCommand {
    CustId: number;
    ProductId: number;
    GroupId: number;
}
