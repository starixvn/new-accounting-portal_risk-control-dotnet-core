import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { BaseQueryModel } from '../../app.model';
import { CompanyService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('CompanyService', () => {
    const fakeQueryModel: BaseQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        housePTType: undefined,
        housePTValue: undefined
    });

    let httpService: HttpService;
    let companyService: CompanyService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                CompanyService
            ]
        });
        httpService = TestBed.get(HttpService);
        companyService = TestBed.get(CompanyService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            companyService.query(fakeQueryModel, true);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyView/Query');
            expect(args[1]).toBe(fakeQueryModel);
            companyService.query(fakeQueryModel, false);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Company/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            companyService.excel(fakeQueryModel, true);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyView/Excel');
            expect(args[1]).toBe(fakeQueryModel);
            companyService.excel(fakeQueryModel, false);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Company/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
