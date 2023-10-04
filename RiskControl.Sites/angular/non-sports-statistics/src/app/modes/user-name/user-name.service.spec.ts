import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { RoleId } from '../../common';
import { UserNameNormalQueryModel, UserNameHistoryQueryModel, UserNameService, UserNameQueryModel } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('UserNameService', () => {

    const fakeNormalQueryModel: UserNameNormalQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: true,
        winlostDate: 'May 31, 2017',
        housePTType: undefined,
        housePTValue: undefined,
        custId: 1,
        roleId: RoleId.Super
    });

    const fakeHistoryQueryModel: UserNameHistoryQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        custId: 1,
        roleId: RoleId.Super
    });

    let httpService: HttpService;
    let userNameService: UserNameService;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                UserNameService
            ]
        });
        httpService = TestBed.get(HttpService);
        userNameService = TestBed.get(UserNameService);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with exact parameters exactly', () => {
            let fakeQueryModel: UserNameQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            userNameService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewNormal/Query');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            userNameService.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewHistory/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            let fakeQueryModel: UserNameQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            userNameService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewNormal/Excel');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            userNameService.excel(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewHistory/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('queryGrandTotal', () => {
        it('should invoke post method with exact parameters exactly', () => {
            let fakeQueryModel: UserNameQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            userNameService.queryGrandTotal(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewGrandTotalNormal/Query');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            userNameService.queryGrandTotal(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewGrandTotalHistory/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excelGrandTotal', () => {
        it('should invoke download method with parameters exactly', () => {
            let fakeQueryModel: UserNameQueryModel;

            // normal mode
            fakeQueryModel = fakeNormalQueryModel;
            userNameService.excelGrandTotal(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewGrandTotalNormal/Excel');
            expect(args[1]).toBe(fakeQueryModel);

            // history mode
            fakeQueryModel = fakeHistoryQueryModel;
            userNameService.excelGrandTotal(fakeQueryModel);
            args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewGrandTotalHistory/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
