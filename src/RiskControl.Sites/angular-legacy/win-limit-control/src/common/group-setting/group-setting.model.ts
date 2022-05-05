export interface HiddenProductBetTypeSetting {
    hidden: boolean;
    setting: ProductBetTypeSetting;
}

export interface ProductBetTypeSettingGroup {
    GroupName: string;
    BetTypes: string[];
}

export interface ProductBetTypeSetting {
    ProductId: number;
    ProductName: string;
    Groups: ProductBetTypeSettingGroup[];
}
