import { NapDate } from "nap-components/date";

export enum CasinoType {
    None = 0,
    RNG = 1,
    SLI = 2
}

export interface Product {
    productId: number;
    productName: string;
    casinoType: CasinoType;
    isSingleWallet: boolean;
}

export interface DownLoadFileModel {
    productIdList : string;
    usernameList: string;
    fromDate: string,
    toDate: string
}

export interface ApiResultModel {
    fileName: string;
    invalidUsernames: string;
    guid: string;
}