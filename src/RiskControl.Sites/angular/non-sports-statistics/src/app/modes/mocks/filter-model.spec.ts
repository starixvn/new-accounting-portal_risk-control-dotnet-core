import * as _ from 'lodash';
import * as moment from 'moment';
import { FilterModel, ReportType, NumberGameLeagueBetType, FilterCollection } from '../../filter';

const fakeFilterCollection: FilterCollection = {
    products: [
        { productName: 'Product 1', productId: 1, casinoType: 0, isSingleWallet: true },
        { productName: 'Product 2', productId: 2, casinoType: 1, isSingleWallet: false }
    ],
    currencies: [
        { exchangeId: -1, currency: 'All', isTest: false },
        { exchangeId: 1, currency: 'USD', isTest: false }
    ],
    gameTypes: [
        { productId: 1, typeId: 1, typeName: 'Game Type 1', isTest: true, gameType: 1 },
        { productId: 2, typeId: 2, typeName: 'Game Type 2', isTest: false, gameType: 2 }
    ],
    devices: [
        { betFrom: 'a', fullName: 'Device 1', groupName: 'desktop' },
        { betFrom: 'b', fullName: 'Device 2', groupName: 'mobile' }
    ]
};

const fakeFilterModel: FilterModel = {
    reportType: undefined,
    roleId: undefined,
    productIds: [1, 2],
    userName: '',
    sites: ['All'],
    betTypes: [1103, 1104],
    leagueIds: [{ leagueId: 15223, betType: 81 }, { leagueId: 50717, betType: 82 }],
    sportTypes: [185, 182],
    currency: [-1],
    devices: ['a', 'd'],
    isExcludeTest: true,
    totalBetType: 0,
    totalBetValue: 0,
    gameIncomeType: 0,
    gameIncomeValue: 0,
    housePTType: 0,
    housePTValue: 0,
    removalColumns: ['TotalWins', 'TotalRefund'],
    isNormalMode: true,
    isViewByInteger: false,
    startDate: moment.utc('2016-11-22T00:00:00.000Z'),
    endDate: moment.utc('2016-11-22T00:00:00.000Z'),
    collection: fakeFilterCollection,
    selectedCollection: fakeFilterCollection,
    isBaseRM: true,
    sportBettypes: []
};

export function createFakeFilterModel(reportType: ReportType): FilterModel {
    return _.extend({}, fakeFilterModel, {
        reportType: reportType
    });
};

export function createFakeFilterModelWithSingleWalletProduct(reportType: ReportType): FilterModel {
    return _.extend({}, fakeFilterModel, {
        productIds: [1],
        products: [
            { productName: 'Product 1', productId: 1, casinoType: 0, isSingleWallet: true }
        ],
        reportType: reportType
    });
}
