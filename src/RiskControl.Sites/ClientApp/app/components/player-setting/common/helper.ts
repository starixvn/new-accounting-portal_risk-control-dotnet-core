import * as _ from 'lodash';
import { PlayerSetting, PlayerCurrencySetting } from '../grid';

export const Helper = {
    calculateSettingCountForCurrencyGroup: calculateSettingCountForCurrencyGroup,
    resetLimitValue: resetLimitValue
};

function calculateSettingCountForCurrencyGroup(playerCurrencySettings: PlayerCurrencySetting[]) {
    for (const currencySetting of playerCurrencySettings) {
        currencySetting.SettingCount = _.sumBy(currencySetting.Products, function (o) { return o.PlayerSettings.length; });
    }
}

function resetLimitValue(playerCurrencySettings: PlayerCurrencySetting[]) {
    for (const currencySetting of playerCurrencySettings) {
        for (const product of currencySetting.Products) {
            for (const playerSetting of product.PlayerSettings) {
                resetPlayerSettingLimitValue(playerSetting);
            }
        }
    }
}

function resetPlayerSettingLimitValue(playerSetting: PlayerSetting) {
    playerSetting.BlackLimit = null;
    playerSetting.GreyLimit = null;
    playerSetting.OrangeLimit = null;
    playerSetting.YellowLimit = null;
    playerSetting.RedLimit = null;
}
