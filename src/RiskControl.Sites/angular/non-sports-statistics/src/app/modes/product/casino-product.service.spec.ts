import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { CasinoType } from '../../common';
import { CasinoProductNormalQueryModel, CasinoProductHistoryQueryModel, CasinoProductQueryModel, CasinoProductService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('CasinoProductService', () => {

    const fakeNormalQueryModel: CasinoProductNormalQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: true,
        winlostDate: 'May 31, 2017',
        housePTType: undefined,
        housePTValue: undefined,
        casinoType: CasinoType.SLI
    });

    const fakeHistoryQueryModel: CasinoProductHistoryQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        casinoType: CasinoType.SLI
    });

    let httpService: HttpService;
    let casinoProductService: CasinoProductService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                CasinoProductService
            ]
        });
        httpService = TestBed.get(HttpService);
        casinoProductService = TestBed.get(CasinoProductService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            let fakeQueryModel: CasinoProductQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            casinoProductService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductNormal/Query');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            casinoProductService.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductHistory/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            let fakeQueryModel: CasinoProductQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            casinoProductService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductNormal/Excel');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            casinoProductService.excel(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductHistory/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('queryGrandTotal', () => {
        it('should invoke post method with exact parameters exactly', () => {
            let fakeQueryModel: CasinoProductQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            casinoProductService.queryGrandTotal(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductGrandTotalNormal/Query');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            casinoProductService.queryGrandTotal(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductGrandTotalHistory/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excelGrandTotal', () => {
        it('should invoke download method with parameters exactly', () => {
            let fakeQueryModel: CasinoProductQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            casinoProductService.excelGrandTotal(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductGrandTotalNormal/Excel');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            casinoProductService.excelGrandTotal(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductGrandTotalHistory/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
