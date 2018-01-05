import { MonitorModel } from './grid.model';
import { FilterModel } from '../filter/filter.model';

export const fakeMonitorModels: MonitorModel[] = [
    createMonitorModel(1, false),
    createMonitorModel(2, true)
];

export function createMonitorModel(seed: number, isNotified: boolean): MonitorModel {
    return {
        CustId: seed,
        UserName: 'User ' + seed,
        SiteId: seed,
        SiteName: 'Site ' + seed,
        CurrencyId: seed,
        CurrencyName: 'Currency ' + seed,
        ProductId: seed,
        ProductName: 'Product ' + seed,
        GroupId: seed,
        GroupName: 'Group ' + seed,
        WinningAmount: seed,
        WinningAmountRM: seed,
        ReachedLimitTime: seed.toString(),
        ReachedLimitLevel: seed,
        NumberReachedLimit: seed,
        IsNotified: isNotified,
        IsBlockedPlaceBet: true,
        IsBlockedTransfer: true,
        IsEnableUnblock: true,
        BlackLimit: -seed,
        GreyLimit: -seed,
        OrangeLimit: seed,
        YellowLimit: seed,
        RedLimit: seed
    };
}
