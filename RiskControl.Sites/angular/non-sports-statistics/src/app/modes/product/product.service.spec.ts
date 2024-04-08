import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { BaseQueryModel } from '../../app.model';
import { ProductService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('ProductService', () => {
    const fakeQueryModel: BaseQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        reportBy: 'Product',
        housePTType: undefined,
        housePTValue: undefined,
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
            productService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyView/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            productService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyView/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
