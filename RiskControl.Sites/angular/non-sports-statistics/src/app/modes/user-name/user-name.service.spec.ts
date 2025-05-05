import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { RoleId } from '../../common';
import { UserNameService, UserNameBaseQueryModel } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('UserNameService', () => {

    const fakeQueryModel: UserNameBaseQueryModel = _.extend({}, fakeBaseQueryModel, {
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
            userNameService.query(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameView/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excel', () => {
        it('should invoke download method with parameters exactly', () => {
            userNameService.excel(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameView/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('queryGrandTotal', () => {
        it('should invoke post method with exact parameters exactly', () => {
            userNameService.queryGrandTotal(fakeQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewGrandTotal/Query');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });

    describe('excelGrandTotal', () => {
        it('should invoke download method with parameters exactly', () => {
            userNameService.excelGrandTotal(fakeQueryModel);
            let args = downloadSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/UserNameViewGrandTotal/Excel');
            expect(args[1]).toBe(fakeQueryModel);
        });
    });
});
