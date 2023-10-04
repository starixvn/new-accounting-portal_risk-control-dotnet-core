import { FilterModel } from '../../filter';
import { ProductLevel } from './product.model';
import { ProductSetting } from './product-setting';

export class NumberGameSetting extends ProductSetting {
    constructor(typeId: number, typeName: string) {
        super(typeId, typeName, [
            ProductLevel.ProductViewLeague,
            ProductLevel.LeagueViewBetType,
            ProductLevel.BetType
        ]);
    }

    updateFilterModel(filterModel: FilterModel) {
        filterModel.sportTypes = [];
        switch (this.level) {
            case ProductLevel.ProductViewLeague:
                filterModel.productIds = [this.typeId];
                break;
            case ProductLevel.LeagueViewBetType:
                filterModel.leagueIds = filterModel.leagueIds.filter(l => l.leagueId === this.typeId);
                break;
            case ProductLevel.BetType:
                filterModel.betTypes = [this.typeId];
                break;
        }
    }
}
