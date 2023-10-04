import { FilterModel } from '../../filter';
import { ProductLevel } from './product.model';
import { ProductSetting } from './product-setting';

export class ProductSportBettypeSetting extends ProductSetting {
  constructor(typeId: number, typeName: string) {
    super(typeId, typeName, [
      ProductLevel.ProductViewSportType,
      ProductLevel.SportTypeViewBetType,
      ProductLevel.BetType
    ]);
  }

  updateFilterModel(filterModel: FilterModel) {
    filterModel.sportTypes = [];
    switch (this.level) {
      case ProductLevel.ProductViewSportType:
        filterModel.productIds = [this.typeId];
        break;
      case ProductLevel.SportTypeViewBetType:
        filterModel.sportBettypes = filterModel.sportBettypes.filter(s => s.sportType === this.typeId);
        break;
      case ProductLevel.BetType:
        filterModel.betTypes = [this.typeId];
        break;
    }
  }
}
