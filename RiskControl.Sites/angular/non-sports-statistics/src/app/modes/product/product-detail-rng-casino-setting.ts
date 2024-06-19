import { ProductId } from "app/common";
import { ProductSetting } from "./product-setting";
import { ProductLevel } from "./product.model";
import { FilterModel } from "app/filter";

export class ProductDetailRngCasinoSetting extends ProductSetting {
    constructor(typeId: number, typeName: string) {
        const rngCasinoLevels = [
            ProductLevel.ProductViewGameGroup,
            ProductLevel.GameGroupViewGameType,
            ProductLevel.GameType
        ];
        const othersLevels = [
            ProductLevel.ProductViewGameType,
            ProductLevel.GameType
        ];
        const levels = typeId === ProductId.RNGCasino ? rngCasinoLevels : othersLevels;
        super(typeId, typeName, levels);
    }

    updateFilterModel(filterModel: FilterModel): void {
        filterModel.leagueIds = [];
        switch (this.level) {
            case ProductLevel.ProductViewGameGroup:
            case ProductLevel.ProductViewGameType:
                filterModel.productIds = [this.typeId];
                break;
            case ProductLevel.GameGroupViewGameType:
                filterModel.sportTypes = [this.typeId];
                break;
            case ProductLevel.GameType:
                filterModel.betTypes = [this.typeId];
                break;
        }
    }

    getReportBySuffix(isDrillDownCurrency: boolean): string {
        let suffix = super.getReportBySuffix(isDrillDownCurrency);
        if (suffix === 'GameType') {
            suffix = 'Casino' + suffix;
        }

        return suffix;
    }
}
