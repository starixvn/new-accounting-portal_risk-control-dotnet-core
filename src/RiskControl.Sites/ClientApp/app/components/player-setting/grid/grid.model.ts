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
    BlackLimit: number | null;
    GreyLimit: number | null;
    OrangeLimit: number | null;
    YellowLimit: number | null;
    RedLimit: number | null;
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
