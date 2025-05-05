import { CasinoType } from '../../common/model';
import {  BaseQueryModel } from '../../app.model';
import { GridModel } from '../mode.model';
import { ProductSetting } from './product-setting';

interface CasinoTypeModel {
    casinoType: CasinoType;
}

export interface CasinoProductQueryModel extends BaseQueryModel, CasinoTypeModel { }

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
