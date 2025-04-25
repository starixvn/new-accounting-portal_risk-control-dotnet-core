export interface PlayerCurrencySetting {
    username: string;
    siteName: string;
    currencyName: string;
    settingCount?: number;
    products: PlayerProductSetting[];
}

export interface PlayerProductSetting {
    productId: number;
    productName: string;
    playerSettings: PlayerSetting[];
}

export interface PlayerSetting {
    custId: number;
    username: string;
    siteId: number;
    siteName: string;
    currencyId: number;
    currencyName: string;
    productId: number;
    productName: string;
    groupId: number;
    groupName: string;
    blackLimit: number;
    greyLimit: number;
    orangeLimit: number;
    yellowLimit: number;
    redLimit: number;
    hasCurrencySetting: boolean;
}

export interface DeleteCommand {
    custId: number;
    productId: number;
    groupId: number;
}

export interface UpdateCommand {
    custId: number;
    productId: number;
    groupId: number;
    levelId: number;
    limit: number;
}
