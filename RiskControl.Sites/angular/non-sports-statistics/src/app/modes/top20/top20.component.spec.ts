import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from 'nap-components/helper';
import { ToastService } from 'nap-components/toast';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { RoleId } from '../../common';
import { ReportType, FilterModel } from '../../filter';
import { BaseQueryModel } from '../../app.model';
import { DailyGridModel } from '../daily';
import { HourlyGridModel } from '../hourly';
import { UserNameBaseQueryModel, UserNameService } from '../user-name';
import { HousePositionTakingQueryModel, HousePositionTakingService } from '../house-position-taking';
import { ModeContext, ModeController } from '../index';
import { Top20GridModel, TopType, Top20BaseQueryModel, Top20Module, Top20Component, Top20Service } from './index';
import { FakeModeController } from '../mocks/mode-controller.spec';
import { createFakeFilterModel, createFakeFilterModelWithSingleWalletProduct } from '../mocks/filter-model.spec';
import { fakeGridModel } from '../mocks/grid-model.spec';
import { expect } from '../../../testing';

const normalForwardGridOptions = require('./mocks/normal/forward-grid-options.json');
const normalBackGridOptions = require('./mocks/normal/back-grid-options.json');
const historyForwardGridOptions = require('./mocks/history/forward-grid-options.json');
const historyBackGridOptions = require('./mocks/history/back-grid-options.json');

function createTop20FakeFilterModel(roleId: RoleId, isNormalMode: boolean): FilterModel {
    const model = createFakeFilterModel(ReportType.Top20);
    model.isNormalMode = isNormalMode;
    model.roleId = roleId;
    return model;
}

function createTop20FakeFilterModelWithSingleWalletProduct(roleId: RoleId, isNormalMode: boolean): FilterModel {
    const model = createFakeFilterModelWithSingleWalletProduct(ReportType.Top20);
    model.isNormalMode = isNormalMode;
    model.roleId = roleId;
    return model;
}

describe('Top20Component', () => {
    let forwardGridOptions: GridOptions;
    let fixture: ComponentFixture<Top20Component>;
    let component: Top20Component;
    let top20Service: Top20Service;
    let userNameService: UserNameService;
    let modeController: ModeController;
    let querySpy: jasmine.Spy;

    function setupTestBed(modeContext: ModeContext) {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                Top20Module
            ],
            providers: [
                { provide: ModeContext, useValue: modeContext },
                { provide: ModeController, useClass: FakeModeController }
            ]
        }).compileComponents();
    }

    function setupInstances() {
        fixture = TestBed.createComponent(Top20Component);
        component = fixture.componentInstance;
        top20Service = fixture.debugElement.injector.get(Top20Service);
        userNameService = fixture.debugElement.injector.get(UserNameService);
        querySpy = spyOn(top20Service, 'query').and.returnValue(of(_.cloneDeep(forwardGridOptions)));
        modeController = fixture.debugElement.injector.get(ModeController);
    }

    function expectGridOptions(gridOption: GridOptions, expectedGridOptions: GridOptions) {
        gridOption.gridExpandHeight = undefined;
        expectedGridOptions.gridExpandHeight = undefined;
        expect(JSON.stringify(gridOption)).toBe(JSON.stringify(expectedGridOptions));
    }

    describe('history mode', () => {

        beforeEach(() => {
            forwardGridOptions = historyForwardGridOptions;
        });

        describe('Super', () => {

            const fakeFilterModel = createTop20FakeFilterModel(RoleId.Super, false);

            describe('forward', () => {
                beforeEach(fakeAsync(() => {
                    const fakeModeContext: ModeContext = {
                        filterModel: fakeFilterModel,
                        gridModel: fakeGridModel,
                        data: undefined,
                        label: undefined
                    };
                    setupTestBed(fakeModeContext);
                }));

                beforeEach(() => {
                    setupInstances();
                });

                it('should invoke query when going forward', () => {
                    fixture.detectChanges();
                    expect(querySpy.calls.any()).toBeTruthy();
                    const args = querySpy.calls.mostRecent().args;
                    const queryModel = args[0] as BaseQueryModel;
                    expect(queryModel.title).toBe('Top 20 Super Game Statistics Report From Nov 22, 2016 To Nov 22, 2016 (Base RM)');
                });

                describe('gridOptions', () => {
                    let gridOptions: GridOptions;

                    beforeEach(fakeAsync(() => {
                        fixture.detectChanges();
                        tick();
                    }));

                    beforeEach(() => {
                        gridOptions = component.gridOptions;
                    });

                    it('should update gridOptions after querying', () => {
                        expectGridOptions(gridOptions, historyBackGridOptions);
                    });

                    describe('drill-down currency', () => {
                        let forwardSpy: jasmine.Spy;
                        let currencyElements: JQuery;

                        beforeEach(() => {
                            forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                            const hostElement = $(fixture.debugElement.nativeElement);
                            currencyElements = hostElement.find('a[drill-down-currency]');
                        });

                        it('should have 2 currency elements', () => {
                            expect(currencyElements.length).toBe(2);
                        });

                        it('should drill down to currency RM of "Top 20" when click on first element', () => {
                            currencyElements[0].click();
                            expect(forwardSpy.calls.any()).toBeTruthy();
                            const args = forwardSpy.calls.mostRecent().args;
                            const modeContext = args[1] as ModeContext;
                            const expectedModeContext = ModeContext.create(
                                'RM',
                                _.extend({}, fakeFilterModel, {
                                    currency: [-1],
                                    sites: ['All']
                                }),
                                new Top20GridModel(true, false, TopType.Winner)
                            );
                            expect(modeContext).toEqual(expectedModeContext);
                        });

                        it('should drill down to currency RM of "Bottom 20" when click on second element', () => {
                            currencyElements[1].click();
                            expect(forwardSpy.calls.any()).toBeTruthy();
                            const args = forwardSpy.calls.mostRecent().args;
                            const modeContext = args[1] as ModeContext;
                            const expectedModeContext = ModeContext.create(
                                'RM',
                                _.extend({}, fakeFilterModel, {
                                    currency: [-1],
                                    sites: ['All']
                                }),
                                new Top20GridModel(true, false, TopType.Loser)
                            );
                            expect(modeContext).toEqual(expectedModeContext);
                        });
                    });

                    describe('drill-down username', () => {
                        let forwardSpy: jasmine.Spy;
                        let usernameElements: JQuery;

                        beforeEach(() => {
                            forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                            const hostElement = $(fixture.debugElement.nativeElement);
                            usernameElements = hostElement.find('a[drill-down-user-name]');
                        });

                        it('should have 2 user-name elements', () => {
                            expect(usernameElements.length).toBe(2);
                        });

                        it('should drill down to level Master', () => {
                            usernameElements[0].click();
                            expect(forwardSpy.calls.any()).toBeTruthy();
                            const args = forwardSpy.calls.mostRecent().args;
                            const modeContext = args[1] as ModeContext;
                            const expectedModeContext = ModeContext.create(
                                'LE',
                                _.extend({}, fakeFilterModel, {
                                    userName: 'LE',
                                    reportType: ReportType.UserName,
                                    roleId: RoleId.Super
                                }),
                                new Top20GridModel(false, true, TopType.All)
                            );
                            expect(modeContext).toEqual(expectedModeContext);
                        });
                    });

                    describe('associated account', () => {
                        let associatedAccountElements: JQuery;

                        beforeEach(() => {
                            const hostElement = $(fixture.debugElement.nativeElement);
                            associatedAccountElements = hostElement.find('a[associated-account]');
                        });

                        it('should have 2 associated-account elements', () => {
                            expect(associatedAccountElements.length).toBe(2);
                        });

                        it('should show associated-account when click on first element', () => {
                            const modalService = fixture.debugElement.injector.get(ModalService);
                            const modalSpy = spyOn(modalService, 'open').and.callFake(() => { });
                            associatedAccountElements[0].click();
                            expect(modalSpy.calls.any()).toBeTruthy();
                            const args = modalSpy.calls.mostRecent().args;
                            const queryModel = args[2] as UserNameBaseQueryModel;
                            expect(queryModel).toHaveMap({
                                productId: '1,2',
                                username: 'LE',
                                site: 'INDO',
                                betType: '2',
                                leagueId: '',
                                sportType: '1',
                                currency: '-1',
                                device: 'a,b',
                                excludeTest: true,
                                viewByInteger: false,
                                totalBetType: 0,
                                totalBetValue: 0,
                                gameIncomeType: 0,
                                gameIncomeValue: 0,
                                removalColumns: ['TotalWins', 'TotalRefund'],
                                sortDirection: '',
                                sortColumnName: '',
                                reportBy: 'Username',
                                isNormalMode: false,
                                title: 'Associated Accounts With LE (Base RM)',
                                isDrillDown: false,
                                isGrandTotal: false,
                                roleId: 0,
                                isBaseRM: true
                            });
                        });
                    });
                });
            });

            describe('back', () => {
                beforeEach(waitForAsync(() => {
                    const fakeModeContext: ModeContext = {
                        filterModel: fakeFilterModel,
                        gridModel: fakeGridModel,
                        data: historyBackGridOptions,
                        label: undefined
                    };
                    setupTestBed(fakeModeContext);
                }));

                beforeEach(() => {
                    setupInstances();
                });

                it('should not invoke query when going back', () => {
                    const firstCount = querySpy.calls.count();
                    fixture.detectChanges();
                    const secondCount = querySpy.calls.count();
                    expect(secondCount - firstCount).toBe(0, 'query not called');
                    expectGridOptions(component.gridOptions, historyBackGridOptions);
                });

                describe('generateTitle', () => {
                    it('should return "Top 20 Super Game Statistics Report From Nov 22, 2016 To Nov 22, 2016 (Base RM)" if last', () => {
                        const title = component.generateTitle(true);
                        expect(title).toBe('Top 20 Super Game Statistics Report From Nov 22, 2016 To Nov 22, 2016 (Base RM)');
                    });

                    it('should return "Top 20 Super" if not last', () => {
                        const title = component.generateTitle(false);
                        expect(title).toBe('Top 20 Super');
                    });
                });

                describe('rendering grid', () => {
                    let hostElement: JQuery;

                    beforeEach(fakeAsync(() => {
                        fixture.detectChanges();
                        tick();
                    }));

                    beforeEach(() => {
                        hostElement = $(fixture.debugElement.nativeElement);
                    });

                    describe('sort', () => {
                        let sortElements: JQuery;

                        beforeEach(() => {
                            sortElements = hostElement.find('.header-container .divSorter');
                        });

                        it('should support sorting on the following columns', () => {
                            const columnNames = sortElements.toArray().map(element => element.attributes['data-columnname'].value);
                            // tslint:disable-next-line:max-line-length
                            const expectedColumnNames = ['BetCount', 'TotalBets', 'GameIncome', 'GamePayout', 'HouseTurnover', 'HouseGrossIncome', 'HouseComm', 'ExtraPT', 'HouseNetIncome'];
                            expect(columnNames).toEqual(expectedColumnNames);
                        });

                        it('should invoke query when clicking on sort column', () => {
                            sortElements[0].click();
                            const args = querySpy.calls.mostRecent().args;
                            const queryModel = args[0] as BaseQueryModel;
                            expect(queryModel).toHaveMap({
                                sortColumnName: 'BetCount',
                                sortDirection: 'desc'
                            });
                        });
                    });

                    describe('excel', () => {
                        it('should invoke excel when clicking button', () => {
                            const excelSpy = spyOn(userNameService, 'excel').and.returnValue(of(null));
                            const helperSpy = spyOn(Helper, 'downloadFile').and.callFake(() => { });
                            const excelButton = hostElement.find('.btnExcel');
                            excelButton.click();
                            expect(excelSpy.calls.any()).toBeTruthy();
                            const args = helperSpy.calls.mostRecent().args;
                            const fileName = args[1] as string;
                            expect(fileName).toBe('Top_20_Super_Game_Statistics_Report_From_Nov_22_2016_To_Nov_22_2016.xlsx');
                        });
                    });
                });
            });
        });

        describe('Master', () => {
            const fakeFilterModel = createTop20FakeFilterModel(RoleId.Master, false);
            const fakeModeContext: ModeContext = {
                filterModel: fakeFilterModel,
                gridModel: fakeGridModel,
                data: undefined,
                label: undefined
            };
            let hostElement: JQuery;

            describe('drill-down user-name', () => {
                beforeEach(fakeAsync(() => {
                    setupTestBed(fakeModeContext);
                    setupInstances();
                    fixture.detectChanges();
                    tick();
                    hostElement = $(fixture.debugElement.nativeElement);
                }));

                it('should drill down to level Agent', () => {
                    const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    const usernameElements = hostElement.find('a[drill-down-user-name]');
                    usernameElements[0].click();
                    expect(forwardSpy.calls.any()).toBeTruthy();
                    const args = forwardSpy.calls.mostRecent().args;
                    const modeContext = args[1] as ModeContext;
                    const expectedModeContext = ModeContext.create(
                        'LE',
                        _.extend({}, fakeFilterModel, {
                            userName: 'LE',
                            reportType: ReportType.UserName,
                            roleId: RoleId.Master
                        }),
                        new Top20GridModel(false, true, TopType.All)
                    );
                    expect(modeContext).toEqual(expectedModeContext);
                });
            });
        });

        describe('Agent', () => {
            const fakeFilterModel = createTop20FakeFilterModel(RoleId.Agent, false);
            const fakeModeContext: ModeContext = {
                filterModel: fakeFilterModel,
                gridModel: fakeGridModel,
                data: undefined,
                label: undefined
            };
            let hostElement: JQuery;

            describe('drill-down user-name', () => {
                beforeEach(fakeAsync(() => {
                    setupTestBed(fakeModeContext);
                    setupInstances();
                    fixture.detectChanges();
                    tick();
                    hostElement = $(fixture.debugElement.nativeElement);
                }));

                it('should drill down to level Member', () => {
                    const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    const usernameElements = hostElement.find('a[drill-down-user-name]');
                    usernameElements[0].click();
                    expect(forwardSpy.calls.any()).toBeTruthy();
                    const args = forwardSpy.calls.mostRecent().args;
                    const modeContext = args[1] as ModeContext;
                    const expectedModeContext = ModeContext.create(
                        'LE',
                        _.extend({}, fakeFilterModel, {
                            userName: 'LE',
                            reportType: ReportType.UserName,
                            roleId: RoleId.Agent
                        }),
                        new Top20GridModel(false, true, TopType.All)
                    );
                    expect(modeContext).toEqual(expectedModeContext);
                });
            });
        });

        describe('Member', () => {
            const fakeFilterModel = createTop20FakeFilterModel(RoleId.Member, false);
            const fakeModeContext: ModeContext = {
                filterModel: fakeFilterModel,
                gridModel: fakeGridModel,
                data: undefined,
                label: undefined
            };
            let hostElement: JQuery;

            describe('drill-down user-name', () => {

                beforeEach(fakeAsync(() => {
                    setupTestBed(fakeModeContext);
                    setupInstances();
                    fixture.detectChanges();
                    tick();
                    hostElement = $(fixture.debugElement.nativeElement);
                }));

                it('should drill down to Daily', () => {
                    const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    const usernameElements = hostElement.find('a[drill-down-user-name]');
                    usernameElements[0].click();
                    expect(forwardSpy.calls.any()).toBeTruthy();
                    const args = forwardSpy.calls.mostRecent().args;
                    const modeContext = args[1] as ModeContext;
                    const expectedModeContext = ModeContext.create(
                        'LE',
                        _.extend({}, fakeFilterModel, {
                            userName: 'LE',
                            reportType: ReportType.Daily
                        }),
                        new DailyGridModel(false, true)
                    );
                    expect(modeContext).toEqual(expectedModeContext);
                });
            });

            describe('excel', () => {
                beforeEach(fakeAsync(() => {
                    fakeFilterModel.startDate = moment.utc('2016-11-22T00:00:00.000Z');
                    fakeFilterModel.endDate = moment.utc('2016-12-31T00:00:00.000Z');
                    setupTestBed(fakeModeContext);
                    setupInstances();
                    fixture.detectChanges();
                    tick();
                    hostElement = $(fixture.debugElement.nativeElement);
                }));

                it('should show error message when export excel', () => {
                    const toastService = fixture.debugElement.injector.get(ToastService);
                    const spy = spyOn(toastService, 'activate').and.callThrough();
                    const excelButton = hostElement.find('.btnExcel');
                    excelButton.click();
                    expect(spy.calls.any()).toBeTruthy();
                    const args = spy.calls.mostRecent().args;
                    expect(args[0]).toBe('Date range should not exceed 1 month to export excel!');
                });
            });
        });

        describe('drill-down from Top 20 Winner', () => {
            beforeEach(fakeAsync(() => {
                const fakeFilterModel = createTop20FakeFilterModel(RoleId.Super, false);
                const fakeModeContext: ModeContext = {
                    filterModel: fakeFilterModel,
                    gridModel: new Top20GridModel(true, false, TopType.Winner),
                    data: undefined,
                    label: undefined
                };
                setupTestBed(fakeModeContext);
                setupInstances();
                fixture.detectChanges();
                tick();
            }));

            it('should invoke query when going forward', () => {
                expect(querySpy.calls.any()).toBeTruthy();
                const args = querySpy.calls.mostRecent().args;
                const queryModel = args[0] as Top20BaseQueryModel;
                expect(queryModel.topType).toBe(TopType.Winner);
            });

            it('should have no associated-account elements', () => {
                const hostElement = $(fixture.debugElement.nativeElement);
                const associatedAccountElements = hostElement.find('a[associated-account]');
                expect(associatedAccountElements.length).toBe(0);
            });
        });
    });

    describe('normal mode', () => {
        describe('Super', () => {
            const fakeFilterModel = createTop20FakeFilterModel(RoleId.Super, true);
            fakeFilterModel.currency = [1];

            beforeEach(fakeAsync(() => {
                const fakeModeContext: ModeContext = {
                    filterModel: fakeFilterModel,
                    gridModel: fakeGridModel,
                    data: undefined,
                    label: undefined
                };
                setupTestBed(fakeModeContext);
            }));

            beforeEach(() => {
                forwardGridOptions = normalForwardGridOptions;
                setupInstances();
            });

            describe('gridOptions', () => {
                let gridOptions: GridOptions;

                beforeEach(fakeAsync(() => {
                    fixture.detectChanges();
                    tick();
                }));

                beforeEach(() => {
                    gridOptions = component.gridOptions;
                });

                it('should update gridOptions after querying', () => {
                    expectGridOptions(gridOptions, normalBackGridOptions);
                });
            });

            describe('house position taking', () => {
                let housePtElements: JQuery;

                beforeEach(fakeAsync(() => {
                    fixture.detectChanges();
                    tick();
                }));

                beforeEach(() => {
                    const hostElement = $(fixture.debugElement.nativeElement);
                    housePtElements = hostElement.find('a[house-position-taking]');
                });

                it('should have 1 house-position-taking elements', () => {
                    expect(housePtElements.length).toBe(1);
                });

                it('should show house-position-taking when click on first element', () => {
                    const housePositionTakingService = fixture.debugElement.injector.get(HousePositionTakingService);
                    const queryHousePositionTakingSpy = spyOn(housePositionTakingService, 'show').and.returnValue(of({}));
                    const modalService = fixture.debugElement.injector.get(ModalService);
                    const modalSpy = spyOn(modalService, 'open').and.callFake(() => { });
                    housePtElements[0].click();
                    expect(queryHousePositionTakingSpy.calls.any()).toBeTruthy();
                    const args = queryHousePositionTakingSpy.calls.mostRecent().args;
                    const housePtQueryModel = args[0] as HousePositionTakingQueryModel;
                    expect(housePtQueryModel).toHaveMap({
                        custId: 21984259
                    });
                    const userName = args[1] as string;
                    expect(userName).toBe('SupertestAuto00');
                });
            });

            describe('associated account', () => {
                let associatedAccountElements: JQuery;

                beforeEach(fakeAsync(() => {
                    fixture.detectChanges();
                    tick();
                }));

                beforeEach(() => {
                    const hostElement = $(fixture.debugElement.nativeElement);
                    associatedAccountElements = hostElement.find('a[associated-account]');
                });

                it('should have 1 associated-account elements', () => {
                    expect(associatedAccountElements.length).toBe(1);
                });

                it('should show associated-account when click on first element', () => {
                    const modalService = fixture.debugElement.injector.get(ModalService);
                    const modalSpy = spyOn(modalService, 'open').and.callFake(() => { });
                    associatedAccountElements[0].click();
                    expect(modalSpy.calls.any()).toBeTruthy();
                    const args = modalSpy.calls.mostRecent().args;
                    const queryModel = args[2] as UserNameBaseQueryModel;
                    expect(queryModel).toHaveMap({
                        productId: '1,2',
                        username: 'SupertestAuto00',
                        site: 'BEST-ODDS',
                        betType: '2',
                        leagueId: '',
                        sportType: '1',
                        currency: '-1',
                        device: 'a,b',
                        excludeTest: true,
                        viewByInteger: false,
                        totalBetType: 0,
                        totalBetValue: 0,
                        gameIncomeType: 0,
                        gameIncomeValue: 0,
                        removalColumns: ['TotalWins', 'TotalRefund'],
                        sortDirection: '',
                        sortColumnName: '',
                        reportBy: 'Username',
                        isNormalMode: true,
                        title: 'Associated Accounts With SupertestAuto00 (Base RM)',
                        isDrillDown: false,
                        isGrandTotal: false,
                        roleId: 0,
                        isBaseRM: true
                    });
                });
            });
        });

        describe('Member', () => {

            describe('filter with multiple products', () => {
                const fakeFilterModel = createTop20FakeFilterModel(RoleId.Member, true);
                const fakeModeContext: ModeContext = {
                    filterModel: fakeFilterModel,
                    gridModel: fakeGridModel,
                    data: undefined,
                    label: undefined
                };
                let hostElement: JQuery;

                describe('drill-down user-name', () => {
                    let userNameElements: JQuery;

                    beforeEach(fakeAsync(() => {
                        setupTestBed(fakeModeContext);
                        setupInstances();
                        fixture.detectChanges();
                        tick();
                        hostElement = $(fixture.debugElement.nativeElement);
                        userNameElements = hostElement.find('a[drill-down-user-name]');
                    }));

                    it('should have no user-name elements', () => {
                        expect(userNameElements.length).toBe(0);
                    });

                    // it('should drill down to Hourly', () => {
                    //     const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    //     const usernameElements = hostElement.find('a[drill-down-user-name]');
                    //     usernameElements[0].click();
                    //     expect(forwardSpy.calls.any()).toBeTruthy();
                    //     const args = forwardSpy.calls.mostRecent().args;
                    //     const modeContext = args[1] as ModeContext;
                    //     const expectedModeContext = ModeContext.create(
                    //         'SupertestAuto00',
                    //         _.extend({}, fakeFilterModel, {
                    //             userName: 'SupertestAuto00',
                    //             reportType: ReportType.Hourly
                    //         }),
                    //         new HourlyGridModel(false, true)
                    //     );
                    //     expect(modeContext).toEqual(expectedModeContext);
                    // });
                });
            });

            describe('filter with single wallet product', () => {
                const fakeFilterModel = createTop20FakeFilterModelWithSingleWalletProduct(RoleId.Member, true);
                const fakeModeContext: ModeContext = {
                    filterModel: fakeFilterModel,
                    gridModel: fakeGridModel,
                    data: undefined,
                    label: undefined
                };
                let hostElement: JQuery;

                beforeEach(() => {
                    forwardGridOptions = normalForwardGridOptions;
                });

                describe('drill-down user-name', () => {
                    let userNameElements: JQuery;

                    beforeEach(fakeAsync(() => {
                        setupTestBed(fakeModeContext);
                        setupInstances();
                        fixture.detectChanges();
                        tick();
                        hostElement = $(fixture.debugElement.nativeElement);
                        userNameElements = hostElement.find('a[drill-down-user-name]');
                    }));

                    it('should have 1 user-name elements', () => {
                        expect(userNameElements.length).toBe(1);
                    });

                    it('should drill down to Hourly', () => {
                        const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                        userNameElements[0].click();
                        expect(forwardSpy.calls.any()).toBeTruthy();
                        const args = forwardSpy.calls.mostRecent().args;
                        const modeContext = args[1] as ModeContext;
                        const expectedModeContext = ModeContext.create(
                            'SupertestAuto00',
                            _.extend({}, fakeFilterModel, {
                                userName: 'SupertestAuto00',
                                reportType: ReportType.Hourly
                            }),
                            new HourlyGridModel(false, true)
                        );
                        expect(modeContext).toEqual(expectedModeContext);
                    });
                });
            });
        });
    });
});
