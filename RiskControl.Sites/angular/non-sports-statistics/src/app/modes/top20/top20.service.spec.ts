import { TestBed, inject } from '@angular/core/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpService, HttpModule } from 'nap-components/http';
import { RoleId } from '../../common';
import { Top20BaseQueryModel, TopType, Top20Service } from './index';
import { fakeBaseQueryModel } from '../mocks/query-model.spec';

describe('Top20Service', () => {

    const fakeNormalQueryModel: Top20BaseQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: true,
        winlostDate: 'May 31, 2017',
        housePTType: undefined,
        housePTValue: undefined,
        custId: 1,
        topType: TopType.All,
        roleId: RoleId.Member
    });

    const fakeHistoryQueryModel: Top20BaseQueryModel = _.extend({}, fakeBaseQueryModel, {
        isNormalMode: false,
        fromDate: 'May 30, 2017',
        toDate: 'May 30, 2017',
        custId: 1,
        topType: TopType.All,
        roleId: RoleId.Member
    });

    let httpService: HttpService;
    let top20Service: Top20Service;
    let postSpy: jasmine.Spy;
    let downloadSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule.forRoot()
            ],
            providers: [
                Top20Service
            ]
        });
        httpService = TestBed.get(HttpService);
        top20Service = TestBed.get(Top20Service);
        postSpy = spyOn(httpService, 'post').and.returnValue(of(null));
        downloadSpy = spyOn(httpService, 'download').and.returnValue(of(null));
    });

    describe('query', () => {
        it('should invoke post method with parameters exactly', () => {
            let fakeQueryModel: Top20BaseQueryModel;

            // normal mode
            fakeQueryModel = _.clone(fakeNormalQueryModel);
            top20Service.query(fakeNormalQueryModel);
            let args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/TopTwentyNormal/Query');
            expect(args[1]).toEqual(fakeQueryModel);

            fakeQueryModel.topType = TopType.Loser;
            top20Service.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/TopTwentyGroupStatisticNormal/Query');
            expect(args[1]).toEqual(fakeQueryModel);

            // history mode
            fakeQueryModel = _.clone(fakeHistoryQueryModel);
            top20Service.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/TopTwentyHistory/Query');
            expect(args[1]).toEqual(fakeQueryModel);

            fakeQueryModel.topType = TopType.Loser;
            top20Service.query(fakeQueryModel);
            args = postSpy.calls.mostRecent().args;
            expect(args[0]).toBe('NonSportsGamesStatistics/TopTwentyGroupStatisticHistory/Query');
            expect(args[1]).toEqual(fakeQueryModel);
        });
    });
});
