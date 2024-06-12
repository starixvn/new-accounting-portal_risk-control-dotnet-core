import { FilterModel } from "app/filter";
import { ProductSetting } from "./product-setting";
import { ProductLevel } from "./product.model";

export class ProductDetailSetting extends ProductSetting {
    constructor(typeId: number, typeName: string) {
        super(typeId, typeName, [
            ProductLevel.ProductViewGameType,
            ProductLevel.GameType
        ]);
    }
    updateFilterModel(filterModel: FilterModel): void {
        switch (this.level) {
            case ProductLevel.ProductViewGameType:
                filterModel.productIds = [this.typeId];
                break;
            case ProductLevel.GameType:
                filterModel.betTypes = [this.typeId];
                break;
        }
    }
}
