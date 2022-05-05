import { FilterModel } from '../../filter';
import { ProductLevel } from './product.model';
import { ProductSetting } from './product-setting';

export class VirtualSportsSetting extends ProductSetting {
    constructor(typeId: number, typeName: string) {
        super(typeId, typeName, [
            ProductLevel.ProductViewSportType,
            ProductLevel.SportTypeViewBetType,
            ProductLevel.BetType
        ]);
    }

    updateFilterModel(filterModel: FilterModel) {
        filterModel.leagueIds = [];
        filterModel.betTypes = [];
        switch (this.level) {
            case ProductLevel.ProductViewSportType:
                filterModel.productIds = [this.typeId];
                break;
            case ProductLevel.SportTypeViewBetType:
                filterModel.sportTypes = [this.typeId];
                break;
            case ProductLevel.BetType:
                filterModel.betTypes = [this.typeId];
                break;
        }
    }
}
