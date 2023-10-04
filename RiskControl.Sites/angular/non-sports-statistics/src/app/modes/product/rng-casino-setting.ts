import { ProductId } from '../../common';
import { FilterModel } from '../../filter';
import { ProductLevel } from './product.model';
import { CasinoSetting } from './casino-setting';

export class RNGCasinoSetting extends CasinoSetting {
    private productId: number;

    isViewSubProduct(isDrillDownCurrency: boolean): boolean {
        return isDrillDownCurrency
            ? this.level === ProductLevel.ProductViewBetType
            : this.level === ProductLevel.CasinoTypeViewProduct;
    }

    drillDown(isDrillDownCurrency: boolean, typeId: number, typeName: string) {
        const rngCasinoLevels = [
            ProductLevel.CasinoTypeViewProduct,
            ProductLevel.ProductViewGameGroup,
            ProductLevel.GameGroupViewGameType,
            ProductLevel.GameType
        ];
        const othersLevels = [
            ProductLevel.CasinoTypeViewProduct,
            ProductLevel.ProductViewGameType,
            ProductLevel.GameType
        ];
        if (this.level === ProductLevel.CasinoTypeViewProduct) {
            this.productId = typeId;
            if (this.productId === ProductId.RNGCasino) {
                this.levels = rngCasinoLevels;
            } else {
                this.levels = othersLevels;
            }
        }

        super.drillDown(isDrillDownCurrency, typeId, typeName);
    }

    updateFilterModel(filterModel: FilterModel) {
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
