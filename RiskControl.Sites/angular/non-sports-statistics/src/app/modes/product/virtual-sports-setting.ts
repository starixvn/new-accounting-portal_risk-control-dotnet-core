import { FilterModel } from '../../filter';
import { ProductLevel } from './product.model';
import { ProductSetting } from './product-setting';
import { ProductConstants } from 'app/common/constants';

export class VirtualSportsSetting extends ProductSetting {
    
    constructor(typeId: number, typeName: string) {
        const commonLevels = [
            ProductLevel.ProductViewSportType,
            ProductLevel.SportTypeViewBetType,
            ProductLevel.BetType
        ];
        const specialLevels = [
            ProductLevel.ProductViewSportType,
            ProductLevel.League,
            ProductLevel.SportTypeViewBetType,
            ProductLevel.BetType
        ];
        const levels = typeId === ProductConstants.VIRTUAL_SPORT_5 ? specialLevels : commonLevels;
        super(typeId, typeName, levels);
    }

    updateFilterModel(filterModel: FilterModel) {
        filterModel.betTypes = [];
        switch (this.level) {
            case ProductLevel.ProductViewSportType:
                filterModel.leagueIds = [];
                filterModel.productIds = [this.typeId];
                break;
            case ProductLevel.SportTypeViewBetType:
                filterModel.leagueIds = [];
                if (filterModel.productIds.join(',') === ProductConstants.VIRTUAL_SPORT_5.toString()) {
                    filterModel.leagueIds = [{leagueId: this.typeId, betType: 0}];
                } else {
                    filterModel.sportTypes = [this.typeId];
                }
                break;
            case ProductLevel.League:
                if (filterModel.productIds.join(',') === ProductConstants.VIRTUAL_SPORT_5.toString()
                    && filterModel.isNormalMode
                    && !this.isDrillDownCurrency) {
                    filterModel.leagueIds = [{leagueId: 0, betType: 0}];
                } else {
                    filterModel.leagueIds = [];
                }
                filterModel.sportTypes = [this.typeId];
                break;
            case ProductLevel.BetType:
                filterModel.betTypes = [this.typeId];
                break;
        }
    }
}
