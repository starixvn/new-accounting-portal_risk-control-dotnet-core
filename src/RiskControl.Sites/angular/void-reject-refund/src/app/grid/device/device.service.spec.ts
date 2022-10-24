import { TestBed } from '@angular/core/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { HttpModule, HttpService } from 'nap-components/http';
import { QueryModelService } from 'src/app/common/query-model.service';
import { FilterModel, ReportType } from 'src/app/filter/filter.model';
import { QueryModel, ExcelQueryModel } from 'src/app/common/model';
import { DeviceService } from './device.service';
import { Helper } from 'nap-components/helper';


describe('DeviceService', () => {
    const fakeTitle = 'Any Title';
    const fakeFilterModel: FilterModel = {
        fromDate: 'Oct 01, 2018',
        toDate: 'Dec 31, 2018',
        reportType: ReportType.Device,
        productIds: [11, 30],
        sites: ['MBC Group', '12Bet'],
        betTypes: [1800, 1801, 1802, 1803, 1804],
        leagueIds: [],
        sportTypes: [],
        currency: [0],
        devices: ['h', 'j'],
        isExcludeTest: true,
        collection: {
            currencies: [
                { exchangeId: 0, currency: 'All', isTest: false },
                { exchangeId: 35, currency: '$US', isTest: false }],
            devices: [
                { betFrom: 'h', fullName: 'Mobile', groupName: 'Mobile' },
                { betFrom: 'j', fullName: 'Credit Member site 2.0', groupName: 'Non-mobile' }
            ],
            gameTypes: [
                { productId: 11, typeId: 1800, typeName: 'AG Casino - Deposit', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1801, typeName: 'Baccarat', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1803, typeName: 'Dragon Tiger', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1802, typeName: 'Roulette', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1804, typeName: 'Sic Bo', isTest: false, gameType: 2 },
                { productId: 15, typeId: 18000, typeName: 'Colossus Bets', isTest: false, gameType: 2 },
                { productId: 30, typeId: 1004, typeName: 'Bullfighting', isTest: false, gameType: 2 }
            ],
            products: [
                { productId: 11, productName: 'AG Casino', casinoType: 2, isSingleWallet: true },
                { productId: 15, productName: 'Colossus Bets', casinoType: 0, isSingleWallet: false },
                { productId: 30, productName: 'Bullfighting', casinoType: 0, isSingleWallet: false }
            ]
        },
        selectedCollection: {
            currencies: [
                { exchangeId: 0, currency: 'All', isTest: false },
                { exchangeId: 35, currency: '$US', isTest: false }],
            devices: [
                { betFrom: 'h', fullName: 'Mobile', groupName: 'Mobile' },
                { betFrom: 'j', fullName: 'Credit Member site 2.0', groupName: 'Non-mobile' }
            ],
            gameTypes: [
                { productId: 11, typeId: 1800, typeName: 'AG Casino - Deposit', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1801, typeName: 'Baccarat', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1803, typeName: 'Dragon Tiger', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1802, typeName: 'Roulette', isTest: false, gameType: 2 },
                { productId: 11, typeId: 1804, typeName: 'Sic Bo', isTest: false, gameType: 2 },
                { productId: 15, typeId: 18000, typeName: 'Colossus Bets', isTest: false, gameType: 2 },
                { productId: 30, typeId: 1004, typeName: 'Bullfighting', isTest: false, gameType: 2 }
            ],
            products: [
                { productId: 11, productName: 'AG Casino', casinoType: 2, isSingleWallet: true },
                { productId: 15, productName: 'Colossus Bets', casinoType: 0, isSingleWallet: false },
                { productId: 30, productName: 'Bullfighting', casinoType: 0, isSingleWallet: false }
            ]
        },
        sortColumnName: '',
        sortDirection: '',
        sportBettypes: []
    };

    const expectedQueryModel: QueryModel = {
        fromDate: 'Oct 01, 2018',
        toDate: 'Dec 31, 2018',
        productId: '11,30',
        site: 'MBC Group,12Bet',
        bettype: '1800,1801,1802,1803,1804',
        leagueId: '',
        sportType: '',
        currency: '0',
        device: 'h,j',
        excludeTest: true,
        reportBy: 6,
        sortColumnName: '',
        sortDirection: '',
        sportBettype: ''
    };

    const expectedExcelQueryModel: ExcelQueryModel = _.extend({}, { title: fakeTitle }, expectedQueryModel);

    let httpService: HttpService;
    let deviceService: DeviceService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;
    let helperSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                DeviceService,
                QueryModelService
            ]
        });

        httpService = TestBed.get(HttpService);
        deviceService = TestBed.get(DeviceService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
        helperSpy = spyOn(Helper, 'downloadFile');
    });

    describe('query', () => {
        it('should invoke post method with exactly filter model parameter', () => {
            let filterModel: FilterModel;
            filterModel = fakeFilterModel;
            deviceService.query(filterModel);
            const args = postSpy.calls.mostRecent().args;
            expect(args[0]).toEqual('api/void-reject-refund/device');
            expect(args[1]).toEqual(expectedQueryModel);
        });
    });

    describe('exportExcel', () => {
        it('should invoke download method with exactly title and filter model parameters', () => {
            const title = fakeTitle;
            let filterModel: FilterModel;
            filterModel = fakeFilterModel;
            deviceService.exportExcel(title, filterModel);
            const args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toEqual('api/void-reject-refund/device/excel');
            expect(args[1]).toEqual(expectedExcelQueryModel);
        });
    });
});
