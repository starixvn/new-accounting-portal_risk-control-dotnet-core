export interface HousePositionTaking {
    product: string;
    housePositionTaking: number;
}

export interface HousePositionTakingModel {
    userName: string;
    housePositionTakings: HousePositionTaking[];
}

export interface HousePositionTakingQueryModel {
    isNormalMode: boolean;
    productId: string;
    custId: number;
    betType: string;
    leagueId: string;
    sportType: string;
    site: string;
    currency: string;
    device: string;
    totalBetType: number;
    totalBetValue: number;
    gameIncomeType: number;
    gameIncomeValue: number;
    housePTType: number;
    housePTValue: number;
    excludeTest: boolean;
    sportBettype: string;
    fromDate: string;
    toDate: string;
}
