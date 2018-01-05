import * as _ from 'lodash';
import { PlayerCurrencySetting } from '../grid';
import { Helper } from './index';
import { fakePlayerCurrencySettings } from '../grid/grid.model.spec';

describe('Helper', () => {
    it('should invoke calculateSettingCountForCurrencyGroup with right output', () => {
        const playerCurrencySettings = _.cloneDeep(fakePlayerCurrencySettings);
        Helper.calculateSettingCountForCurrencyGroup(playerCurrencySettings);
        expect(playerCurrencySettings[0].SettingCount).toBe(3);
        expect(playerCurrencySettings[1].SettingCount).toBe(1);
    });

    it('should invoke resetLimitValue with right output', () => {
        const playerCurrencySettings = _.cloneDeep(fakePlayerCurrencySettings);
        Helper.resetLimitValue(playerCurrencySettings);
        playerCurrencySettings.forEach(currencySetting => {
            currencySetting.Products.forEach(productSetting => {
                productSetting.PlayerSettings.forEach(playerSetting => {
                    expect(playerSetting.BlackLimit).toBeNull();
                    expect(playerSetting.GreyLimit).toBeNull();
                    expect(playerSetting.OrangeLimit).toBeNull();
                    expect(playerSetting.YellowLimit).toBeNull();
                    expect(playerSetting.RedLimit).toBeNull();
                });
            });
        });
    });
});
