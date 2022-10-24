export interface RepresentativeBettypeModel {
    productID: number;
    productName: string;
    betType: number;
}

export interface UnssignedBettypeModel {
    bettype: number;
    typenamee: string;
    selected: boolean;
}

export interface GroupSettingModel {
    productID: number;
    groupID: number;
    groupName: string;
    betTypeID: number;
    typenamee: string;
    selected: boolean;
    isLegend: boolean;
}

export interface GroupGroupSettingModel {
    groupID: number;
    groupName: string;
    productID: number;
    selected: boolean;
    items: GroupSettingModel[];
    maxItems: number;
}

export interface GameGroupSetting {
    productId: number;
    bettypeIds: string;
    groupId: number;
}
