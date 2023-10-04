import { AppService } from "./app.service";
import {
    CurrencyNetIncome,
    MonthlyTurnoverAndNetIncome,
    ProductTurnover,
    TopGameTypeWinning,
    TopMemberWinning,
    WinLossLimit,
    BalanceUpModel
} from './app.model';
import { of } from 'rxjs';

describe('App Service get method', () => {
    let httpServiceGetSpy: { get: jasmine.Spy };
    let appService: AppService;

    beforeEach(() => {
        // TODO: spy on other methods too
        httpServiceGetSpy = jasmine.createSpyObj('HttpService', ['get']);
        appService = new AppService(httpServiceGetSpy as any);
    });

    it('should return expected currency net income (HttpService called once)', () => {
        const expectedCurrencyNetIncome: CurrencyNetIncome[] =
            [{ Currency: 'UUS', NetIncome: 10 }, { Currency: 'HKK', NetIncome: 5 }, { Currency: 'US$', NetIncome: 20 }];

        httpServiceGetSpy.get.and.returnValue(of(expectedCurrencyNetIncome));

        appService.queryCurrencyNetIncome().subscribe(
            data => expect(data).toEqual(expectedCurrencyNetIncome, 'expected currency net income'),
            fail
        );

        expect(httpServiceGetSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return expected monthly turnover and net income (HttpService called once)', () => {
        const expectedMonthlyTurnoverAndNetIncome: MonthlyTurnoverAndNetIncome[] =
            [{ Month: '10/2018', Turnover: 5, NetIncome: 2 },
            { Month: '11/2018', Turnover: 10, NetIncome: 5 },
            { Month: '12/2018', Turnover: 8, NetIncome: 5 },
            { Month: '01/2019', Turnover: 12, NetIncome: 10 },
            { Month: '02/2019', Turnover: 10, NetIncome: 8 },
            { Month: '03/2019', Turnover: 20, NetIncome: 15 }];

        httpServiceGetSpy.get.and.returnValue(of(expectedMonthlyTurnoverAndNetIncome));

        appService.queryMonthlyTurnoverAndNetIncome().subscribe(
            data => expect(data).toEqual(expectedMonthlyTurnoverAndNetIncome, 'expected monthly turnover and net income'),
            fail
        );

        expect(httpServiceGetSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return expected product turnover (HttpService called once)', () => {
        const expectedProductTurnover: ProductTurnover[] =
            [{ Product: 'UUS', Turnover: 100 }, { Product: 'HKK', Turnover: 150 }, { Product: 'US$', Turnover: 50 }];

        httpServiceGetSpy.get.and.returnValue(of(expectedProductTurnover));

        appService.queryProductTurnover().subscribe(
            data => expect(data).toEqual(expectedProductTurnover, 'expected product turnover'),
            fail
        );

        expect(httpServiceGetSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return expected top game type winning (HttpService called once)', () => {
        const expectedTopGameTypeWinning: TopGameTypeWinning[] =
            [{ Bettype: 'BidMe', Product: 'Gold Deluxe', GameIncome: -150 },
            { Bettype: 'Roulette', Product: 'Gold Deluxe', GameIncome: -100 },
            { Bettype: 'Tales of Brothel', Product: 'RNG Casino', GameIncome: -50 }];

        httpServiceGetSpy.get.and.returnValue(of(expectedTopGameTypeWinning));

        appService.queryTopGameTypeWinning().subscribe(
            data => expect(data).toEqual(expectedTopGameTypeWinning, 'expected top game type winning'),
            fail
        );

        expect(httpServiceGetSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return expected top member winning (HttpService called once)', () => {
        const expectedTopMemberWinning: TopMemberWinning[] =
            [{ Username: 'QQMAQW11333', Currency: 'RM', GameIncome: -150 },
            { Username: 'QQMAQW11555', Currency: 'RM', GameIncome: -120 },
            { Username: 'ACGUUS3838033', Currency: 'SD$', GameIncome: -50 }];

        httpServiceGetSpy.get.and.returnValue(of(expectedTopMemberWinning));

        appService.queryTopMemberWinning().subscribe(
            data => expect(data).toEqual(expectedTopMemberWinning, 'expected top member winning'),
            fail
        );

        expect(httpServiceGetSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return expected win loss limit (HttpService called once)', () => {
        const expectedWinLossLimit: WinLossLimit[] =
            [{ UserName: '12BETEURO01033', Currency: 'EURO', Product: 'PP', LimitLevel: 3 },
            { UserName: '12BETEURO01033', Currency: 'EURO', Product: 'Allbet', LimitLevel: 102 },
            { UserName: '12BETEURO01033', Currency: 'EURO', Product: 'PP', LimitLevel: 3 }];

        httpServiceGetSpy.get.and.returnValue(of(expectedWinLossLimit));

        appService.queryWinLossLimit().subscribe(
            data => expect(data).toEqual(expectedWinLossLimit, 'expected win loss limit'),
            fail
        );

        expect(httpServiceGetSpy.get.calls.count()).toBe(1, 'one call');
    });
});

describe('App Service post method', () => {
    let httpServicePostSpy: { post: jasmine.Spy };
    let appService: AppService;

    beforeEach(() => {
        // TODO: spy on other methods too
        httpServicePostSpy = jasmine.createSpyObj('HttpService', ['post']);
        appService = new AppService(httpServicePostSpy as any);
    });

    it('should return expected balance up model (HttpService called once)', () => {
        const expectedBalanceUpModel: BalanceUpModel = {
            today: '03/27/2019', balanceUpRange: { balanceUpDay: '02/28/2019', moveBetsDay: '03/31/2019' }
        };

        httpServicePostSpy.post.and.returnValue(of(expectedBalanceUpModel));

        appService.getBalanceup().subscribe(
            data => expect(data).toEqual(expectedBalanceUpModel, 'expected balance up model'),
            fail
        );

        expect(httpServicePostSpy.post.calls.count()).toBe(1, 'one call');
    });
});

