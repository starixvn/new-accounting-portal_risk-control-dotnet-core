import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { QueryModel, BaseQueryModel, NormalQueryModel, HistoryQueryModel } from '../../app.model';
import { ProductService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('ProductService', () => {

    const fakeNormalQueryModel: NormalQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: true,
        winlostDate: 'May 31, 2017',
        housePTType: undefined,
        housePTValue: undefined,
        reportBy: 'Product'
    });

    const fakeHistoryQueryModel: HistoryQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        reportBy: 'Product'
    });

    let httpService: HttpService;
    let productService: ProductService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                ProductService
            ]
        });
        httpService = TestBed.get(HttpService);
        productService = TestBed.get(ProductService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            let fakeQueryModel: QueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            productService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyViewNormal/Query');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            productService.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyViewHistory/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            let fakeQueryModel: QueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            productService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyViewNormal/Excel');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            productService.excel(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyViewHistory/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
