import { TestBed } from '@angular/core/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { HourlyService, HourlyQueryModel } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('HourlyService', () => {

    const fakeQueryModel: HourlyQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        housePTType: undefined,
        housePTValue: undefined
    });

    let httpService: HttpService;
    let hourlyService: HourlyService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                HourlyService
            ]
        });
        httpService = TestBed.get(HttpService);
        hourlyService = TestBed.get(HourlyService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            hourlyService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Hourly/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            hourlyService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Hourly/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
