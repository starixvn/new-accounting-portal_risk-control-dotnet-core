import * as _ from 'lodash';
import { PlayerSetting, PlayerCurrencySetting } from '../grid';

export const Helper = {
    calculateSettingCountForCurrencyGroup: calculateSettingCountForCurrencyGroup,
    resetLimitValue: resetLimitValue
};

function calculateSettingCountForCurrencyGroup(playerCurrencySettings: PlayerCurrencySetting[]) {
    for (const currencySetting of playerCurrencySettings) {
        currencySetting.settingCount = _.sumBy(currencySetting.products, function (o) { return o.playerSettings.length; });
    }
}

function resetLimitValue(playerCurrencySettings: PlayerCurrencySetting[]) {
    for (const currencySetting of playerCurrencySettings) {
        for (const product of currencySetting.products) {
            for (const playerSetting of product.playerSettings) {
                resetPlayerSettingLimitValue(playerSetting);
            }
        }
    }
}

function resetPlayerSettingLimitValue(playerSetting: PlayerSetting) {
    playerSetting.blackLimit = null;
    playerSetting.greyLimit = null;
    playerSetting.orangeLimit = null;
    playerSetting.yellowLimit = null;
    playerSetting.redLimit = null;
}
