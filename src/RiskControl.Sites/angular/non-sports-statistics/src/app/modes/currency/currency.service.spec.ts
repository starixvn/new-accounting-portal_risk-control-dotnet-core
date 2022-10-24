import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { QueryModel, BaseQueryModel, NormalQueryModel, HistoryQueryModel } from '../../app.model';
import { CurrencyQueryModel, CurrencyNormalQueryModel, CurrencyHistoryQueryModel, CurrencyService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('CurrencyService', () => {

    const fakeNormalQueryModel: CurrencyNormalQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: true,
        winlostDate: 'May 31, 2017',
        housePTType: undefined,
        housePTValue: undefined,
        drillDownCurrency: 1
    });

    const fakeHistoryQueryModel: CurrencyHistoryQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        drillDownCurrency: 1
    });

    let httpService: HttpService;
    let currencyService: CurrencyService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                CurrencyService
            ]
        });
        httpService = TestBed.get(HttpService);
        currencyService = TestBed.get(CurrencyService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            let fakeQueryModel: CurrencyQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            currencyService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewNormal/Query');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            currencyService.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewHistory/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            let fakeQueryModel: CurrencyQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            currencyService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewNormal/Excel');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            currencyService.excel(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewHistory/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('queryGrandTotal', () => {
        it('should invoke post method with exact parameters exactly', () => {
            let fakeQueryModel: CurrencyQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            currencyService.queryGrandTotal(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewGrandTotalNormal/Query');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            currencyService.queryGrandTotal(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewGrandTotalHistory/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excelGrandTotal', () => {
        it('should invoke download method with parameters exactly', () => {
            let fakeQueryModel: CurrencyQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            currencyService.excelGrandTotal(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewGrandTotalNormal/Excel');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            currencyService.excelGrandTotal(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/CurrencyViewGrandTotalHistory/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
