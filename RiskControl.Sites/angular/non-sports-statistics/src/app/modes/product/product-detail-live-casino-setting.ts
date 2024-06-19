import { ProductId } from "app/common";
import { ProductSetting } from "./product-setting";
import { ProductLevel } from "./product.model";
import { FilterModel } from "app/filter";

export class ProductDetailLiveCasinoSetting extends ProductSetting {
    constructor(typeId: number, typeName: string) {
        const liveCasinoLevels = [
            ProductLevel.ProductViewGameType,
            ProductLevel.GameTypeViewGameTable,
            ProductLevel.GameTable
        ];
        const othersLevels = [
            ProductLevel.ProductViewGameType,
            ProductLevel.GameType
        ];
        const levels = typeId === ProductId.LiveCasino ? liveCasinoLevels : othersLevels;
        super(typeId, typeName, levels);
    }

    updateFilterModel(filterModel: FilterModel): void {
        switch (this.level) {
            case ProductLevel.ProductViewGameType:
                filterModel.productIds = [this.typeId];
                break;
            case ProductLevel.GameTypeViewGameTable:
            case ProductLevel.GameType:
                filterModel.betTypes = [this.typeId];
                break;
        }
    }
}
