import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { BaseQueryModel} from '../../app.model';
import { DailyQueryModel, DailyService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('DailyService', () => {

    const fakeQueryModel: DailyQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        housePTType: undefined,
        housePTValue: undefined,
        usernameDrillDown: true
    });

    let httpService: HttpService;
    let dailyService: DailyService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                DailyService
            ]
        });
        httpService = TestBed.get(HttpService);
        dailyService = TestBed.get(DailyService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            dailyService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Daily/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            dailyService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Daily/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
