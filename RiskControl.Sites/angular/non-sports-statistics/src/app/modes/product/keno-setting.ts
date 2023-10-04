import { FilterModel } from '../../filter';
import { ProductLevel } from './product.model';
import { ProductSetting } from './product-setting';

export class KenoSetting extends ProductSetting {
    constructor(typeId: number, typeName: string) {
        super(typeId, typeName, [
            ProductLevel.ProductViewBetType,
            ProductLevel.BetType
        ]);
    }

    updateFilterModel(filterModel: FilterModel) {
        filterModel.sportTypes = [];
        filterModel.leagueIds = [];
        filterModel.sportBettypes = [];
        switch (this.level) {
            case ProductLevel.ProductViewBetType:
                filterModel.productIds = [this.typeId];
                break;
            case ProductLevel.BetType:
                filterModel.betTypes = [this.typeId];
                break;
        }
    }
}
