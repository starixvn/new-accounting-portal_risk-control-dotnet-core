import { Injectable } from '@angular/core';
import {  ProductId } from '../../common';
import { FilterConfig } from '../../filter';
import { ModeContext } from '../mode-context';

@Injectable()
export class GridService {
    constructor(
        private readonly modeContext: ModeContext
    ) { }

    isDrilldown(): boolean {
        const gridModel = this.modeContext.gridModel;
        return gridModel.isDrillDownCurrency;
    }

    hasCurrencyColumn(): boolean {
        const filterModel = this.modeContext.filterModel;
        return filterModel.removalColumns.indexOf(FilterConfig.gridColumns.currency.value) === -1;
    }

    hasShowAssociatedAccount() {
        const filterModel = this.modeContext.filterModel;
        return filterModel.removalColumns.indexOf(FilterConfig.gridColumns.associatedAccount.value) === -1;
    }

    hasShowHousePositionTaking() {
        const filterModel = this.modeContext.filterModel;
        return filterModel.isNormalMode && filterModel.removalColumns.indexOf(FilterConfig.gridColumns.housePositionTaking.value) === -1;
    }

    hasDrillDownUserName() {
        const filterModel = this.modeContext.filterModel;
        return !filterModel.isNormalMode;
    }

    hasDrillDownHourly(): boolean {
        let hasDrillDown = false;
        const filterModel = this.modeContext.filterModel;
        const isCurrencyBaseRM = filterModel.isBaseRM;
        if (isCurrencyBaseRM && filterModel.productIds.length === 1) {
            const product = filterModel.selectedCollection.products.filter(x => x.productId === filterModel.productIds[0])[0];
            hasDrillDown = product.productId !== ProductId.FishingWorld
             && product.productId !== ProductId.Bullfighting
             && product.productId !== ProductId.PokerGames
             && product.isSingleWallet;
        }

        return hasDrillDown;
    }
}
