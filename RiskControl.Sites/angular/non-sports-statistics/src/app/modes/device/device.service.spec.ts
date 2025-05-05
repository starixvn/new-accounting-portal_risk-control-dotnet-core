import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { BaseQueryModel } from '../../app.model';
import { DeviceService } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('DeviceService', () => {
    const fakeQueryModel: BaseQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        housePTType: undefined,
        housePTValue: undefined
    });

    let httpService: HttpService;
    let deviceService: DeviceService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                DeviceService
            ]
        });
        httpService = TestBed.get(HttpService);
        deviceService = TestBed.get(DeviceService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            deviceService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Device/Query');
            expect(args[1]).toBe(fakeQueryModel);
            fakeQueryModel.isDrillDown = true;
            deviceService.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyView/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            deviceService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/Device/Excel');
            expect(args[1]).toBe(fakeQueryModel);
            fakeQueryModel.isDrillDown = true;
            deviceService.excel(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/DailyView/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
