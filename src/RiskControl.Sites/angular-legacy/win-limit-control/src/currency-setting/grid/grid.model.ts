export interface ProductSettingGroup {
    productId: number;
    currencyId: number;
    siteId: number;
    groupId: number;
    groupName: string;
    isBlockedPlacebetRedLevel: boolean;
    isBlockedTransferRedLevel: boolean;
    isCreditSite: boolean;
    blackLimit: number;
    greyLimit: number;
    orangeLimit: number;
    yellowLimit: number;
    redLimit: number;
}

export interface ProductSetting {
    productName: string;
    currencyName: string;
    siteName: string;
    groups: ProductSettingGroup[];
}

export interface CommandResult {
    errorCode: number;
    isValid: boolean;
}

export interface InactiveSite {
    productId: number;
    groupId: number;
    levelId: number;
    exchangeID: number;
    maxWinLimit: number;
    isBlockedPlaceBet: boolean;
    isBlockedTransfer: boolean;
}

export interface ClickedAllPageModel {
    blackLimit: number;
    greyLimit: number;
    orangeLimit: number;
    yellowLimit: number;
    redLimit: number;
    blockedPlaceBet: boolean;
    blockedTransfer: boolean;
}
