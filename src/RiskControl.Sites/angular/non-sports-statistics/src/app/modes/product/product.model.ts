import { CasinoType } from '../../common/model';
import { NormalQueryModel, HistoryQueryModel } from '../../app.model';
import { GridModel } from '../mode.model';
import { ProductSetting } from './product-setting';

interface CasinoTypeModel {
    casinoType: CasinoType;
}

export interface CasinoProductNormalQueryModel extends NormalQueryModel, CasinoTypeModel { }

export interface CasinoProductHistoryQueryModel extends HistoryQueryModel, CasinoTypeModel { }

export type CasinoProductQueryModel = CasinoProductNormalQueryModel | CasinoProductHistoryQueryModel;

export enum ProductLevel {
    CasinoTypeViewProduct,
    ProductViewSportType,
    ProductViewGameGroup,
    ProductViewGameType,
    ProductViewBetType,
    ProductViewLeague,
    SportTypeViewBetType,
    LeagueViewBetType,
    BetTypeViewLeague,
    GameGroupViewGameType,
    GameTypeViewGameTable,
    League,
    BetType,
    GameType,
    GameTable
}

export class ProductGridModel extends GridModel {
    readonly productSetting: ProductSetting;

    constructor(isDrillDown: boolean, productSetting: ProductSetting) {
        super(isDrillDown);
        this.productSetting = productSetting;
    }
}
