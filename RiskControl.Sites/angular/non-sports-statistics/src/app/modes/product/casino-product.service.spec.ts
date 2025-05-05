import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { CasinoType } from '../../common';
import { CasinoProductQueryModel, CasinoProductService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('CasinoProductService', () => {

    const fakeQueryModel: CasinoProductQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        casinoType: CasinoType.SLI,
        housePTType: undefined,
        housePTValue: undefined,
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
            casinoProductService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Product/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            casinoProductService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Product/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('queryGrandTotal', () => {
        it('should invoke post method with exact parameters exactly', () => {
            casinoProductService.queryGrandTotal(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductGrandTotal/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excelGrandTotal', () => {
        it('should invoke download method with parameters exactly', () => {
            casinoProductService.excelGrandTotal(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/ProductGrandTotal/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
