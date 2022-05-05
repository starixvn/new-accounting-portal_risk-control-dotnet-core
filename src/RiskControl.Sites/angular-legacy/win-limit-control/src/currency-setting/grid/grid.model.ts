export interface ProductSettingGroup {
    ProductId: number;
    CurrencyId: number;
    SiteId: number;
    GroupId: number;
    GroupName: string;
    IsBlockedPlacebetRedLevel: boolean;
    IsBlockedTransferRedLevel: boolean;
    IsCreditSite: boolean;
    BlackLimit: number;
    GreyLimit: number;
    OrangeLimit: number;
    YellowLimit: number;
    RedLimit: number;
}

export interface ProductSetting {
    ProductName: string;
    CurrencyName: string;
    SiteName: string;
    Groups: ProductSettingGroup[];
}

export interface CommandResult {
    ErrorCode: number;
    IsValid: boolean;
}
