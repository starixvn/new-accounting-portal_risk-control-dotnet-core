import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpService, HttpModule } from 'nap-components/http';
import { FilterService } from './index';
import { fakeProducts, fakeSiteGroups, fakeCurrencies } from './filter.model.spec';

describe('FilterService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                FilterService
            ]
        });
    });

    it('should invoke queryProducts method with right parameters and returns data of httpService',
        inject([HttpService, FilterService], (httpService: HttpService, filterService: FilterService) => {
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(fakeProducts));
            const result = filterService.queryProducts();
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/filter/get-products');
            result.subscribe(model => {
                expect(model).toEqual(fakeProducts);
            });
        }));

    it('should invoke querySites method with right parameters and returns data of httpService',
        inject([HttpService, FilterService], (httpService: HttpService, filterService: FilterService) => {
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(fakeSiteGroups));
            const result = filterService.querySites(0);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/filter/get-sites');
            result.subscribe(model => {
                expect(model).toEqual(fakeSiteGroups);
            });
        }));

    it('should invoke queryCurrencies method with right parameters and returns data of httpService',
        inject([HttpService, FilterService], (httpService: HttpService, filterService: FilterService) => {
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(fakeCurrencies));
            const result = filterService.queryCurrencies({
                siteId: 1,
                excludeTestCurrency: true,
                isCreditSite: true
            });
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/filter/get-currencies');
            result.subscribe(model => {
                expect(model).toEqual(fakeCurrencies);
            });
        }));

    it('should invoke queryUserName method with right parameters and returns data of httpService',
        inject([HttpService, FilterService], (httpService: HttpService, filterService: FilterService) => {
            const fakeData = ['1234', '1235'];
            const spy = spyOn(httpService, 'get').and.returnValue(Observable.of(fakeData));
            const result = filterService.queryUserName('123');
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('api/win-limit-control/filter/search-users?term=123');
            expect(args[1]).toBe(null);
            expect(args[2]).toEqual({
                noSpinner: true,
                noToast: true
            });
            result.subscribe(model => {
                expect(model).toEqual(fakeData);
            });
        }));
});
