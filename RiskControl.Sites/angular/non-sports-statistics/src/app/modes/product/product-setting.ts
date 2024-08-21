import { FilterModel } from '../../filter';
import { ProductLevel } from './product.model';

export abstract class ProductSetting {
  private levelIndex = 0;
  public isDrillDownCurrency = false;

  private readonly viewBetTypeList = [4, 6, 7, 12];
  private readonly viewLeagueList = [5, 8, 11];
  private readonly viewGameTypeList = [3, 9, 13];
  private readonly viewGameTableList = [10, 14];


  constructor(public typeId: number, public typeName: string, public levels: ProductLevel[]) {
  }

  get level(): ProductLevel {
    return this.levels[this.levelIndex];
  }

  hasDrillDownProduct(): boolean {
    return this.levelIndex < this.levels.length - 2;
  }

  hasDrillDownCurrency(): boolean {
    return this.levelIndex < this.levels.length - 1;
  }

  drillDown(isDrillDownCurrency: boolean, typeId: number, typeName: string) {
    if ((isDrillDownCurrency && !this.hasDrillDownCurrency())
      || (!isDrillDownCurrency && !this.hasDrillDownProduct())) {
      throw new Error('Unable to drill down');
    }

    this.typeId = typeId;
    this.typeName = typeName;
    this.levelIndex++;
    this.isDrillDownCurrency = isDrillDownCurrency;
  }

  getReportBySuffix(isDrillDownCurrency: boolean): string {
    let level = this.level;
    if (isDrillDownCurrency) {
      level = this.levels[this.levelIndex - 1];
    }

    if (level === ProductLevel.CasinoTypeViewProduct) {
      return 'SubProduct';
    }

    if (level === ProductLevel.ProductViewSportType) {
      return 'SportType';
    }

    if (this.viewLeagueList.includes(level)) {
      return 'League';
    }

    if (this.viewBetTypeList.includes(level)) {
      return 'BetType';
    }

    if (level === ProductLevel.ProductViewGameGroup) {
      return 'CasinoGameGroup';
    }

    if (this.viewGameTypeList.includes(level)) {
      return 'GameType';
    }

    if (this.viewGameTableList.includes(level)) {
      return 'GameTable';
    }

    return '';
  }

  abstract updateFilterModel(filterModel: FilterModel): void;
}
