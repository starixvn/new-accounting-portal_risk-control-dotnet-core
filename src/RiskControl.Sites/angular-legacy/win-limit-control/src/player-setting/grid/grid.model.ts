export interface PlayerCurrencySetting {
    Username: string;
    SiteName: string;
    CurrencyName: string;
    SettingCount?: number;
    Products: PlayerProductSetting[];
}

export interface PlayerProductSetting {
    ProductName: string;
    PlayerSettings: PlayerSetting[];
}

export interface PlayerSetting {
    CustId: number;
    Username: string;
    SiteId: number;
    SiteName: string;
    CurrencyId: number;
    CurrencyName: string;
    ProductId: number;
    ProductName: string;
    GroupId: number;
    GroupName: string;
    BlackLimit: number;
    GreyLimit: number;
    OrangeLimit: number;
    YellowLimit: number;
    RedLimit: number;
    HasCurrencySetting: boolean;
}

export interface DeleteCommand {
    CustId: number;
    ProductId: number;
    GroupId: number;
}

export interface UpdateCommand {
    CustId: number;
    ProductId: number;
    GroupId: number;
    LevelId: number;
    Limit: number;
}
