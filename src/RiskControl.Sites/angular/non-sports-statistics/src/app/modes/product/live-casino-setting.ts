import { ProductId } from '../../common';
import { FilterModel } from '../../filter';
import { CasinoSetting } from './casino-setting';
import { ProductLevel } from './product.model';

export class LiveCasinoSetting extends CasinoSetting {
    private productId: number;

    isViewSubProduct(isDrillDownCurrency: boolean): boolean {
        return isDrillDownCurrency
            ? this.level === ProductLevel.ProductViewGameType
            : this.level === ProductLevel.CasinoTypeViewProduct;
    }

    drillDown(isDrillDownCurrency: boolean, typeId: number, typeName: string) {
        const liveCasinoLevels = [
            ProductLevel.CasinoTypeViewProduct,
            ProductLevel.ProductViewGameType,
            ProductLevel.GameTypeViewGameTable,
            ProductLevel.GameTable
        ];
        const othersLevels = [
            ProductLevel.CasinoTypeViewProduct,
            ProductLevel.ProductViewGameType,
            ProductLevel.GameType
        ];
        if (this.level === ProductLevel.CasinoTypeViewProduct) {
            this.productId = typeId;
            if (this.productId === ProductId.LiveCasino) {
                this.levels = liveCasinoLevels;
            } else {
                this.levels = othersLevels;
            }
        }

        super.drillDown(isDrillDownCurrency, typeId, typeName);
    }

    updateFilterModel(filterModel: FilterModel) {
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
