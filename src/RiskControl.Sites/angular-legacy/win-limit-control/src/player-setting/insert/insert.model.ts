export interface InsertCommand {
    custId: number;
    currencyId: number;
    siteId: number;
    productId: number;
    groupId: number;
    blackLimit: number;
    greyLimit: number;
    orangeLimit: number;
    yellowLimit: number;
    redLimit: number;
}
