export interface HiddenProductBetTypeSetting {
    hidden: boolean;
    setting: ProductBetTypeSetting;
}

export interface ProductBetTypeSettingGroup {
    groupName: string;
    betTypes: string[];
}

export interface ProductBetTypeSetting {
    productId: number;
    productName: string;
    groups: ProductBetTypeSettingGroup[];
}
