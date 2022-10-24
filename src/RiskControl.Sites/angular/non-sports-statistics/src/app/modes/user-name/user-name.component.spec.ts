import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from 'nap-components/helper';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { RoleId } from '../../common';
import { ReportType, FilterModel } from '../../filter';
import { QueryModel } from '../../app.model';
import { DailyGridModel } from '../daily';
import { HourlyGridModel } from '../hourly';
import { HousePositionTakingQueryModel, HousePositionTakingService } from '../house-position-taking';
import { ModeContext, ModeController } from '../index';
import { UserNameComponent, UserNameModule, UserNameService, UserNameQueryModel, UserNameGridModel } from './index';
import { FakeModeController } from '../mocks/mode-controller.spec';
import { createFakeFilterModel, createFakeFilterModelWithSingleWalletProduct } from '../mocks/filter-model.spec';
import { fakeGridModel } from '../mocks/grid-model.spec';
import { expect } from '../../../testing';

const normalForwardGridOptions = require('./mocks/normal/forward-grid-options.json');
const normalBackGridOptions = require('./mocks/normal/back-grid-options.json');
const historyForwardGridOptions = require('./mocks/history/forward-grid-options.json');
const historyBackGridOptions = require('./mocks/history/back-grid-options.json');

function createUserNameFakeFilterModel(roleId: RoleId, isNormalMode: boolean): FilterModel {
    const model = createFakeFilterModel(ReportType.UserName);
    model.isNormalMode = isNormalMode;
    model.roleId = roleId;
    return model;
}

function createUserNameFakeFilterModelWithSingleWalletProduct(roleId: RoleId, isNormalMode: boolean): FilterModel {
    const model = createFakeFilterModelWithSingleWalletProduct(ReportType.UserName);
    model.isNormalMode = isNormalMode;
    model.roleId = roleId;
    return model;
}

describe('UserNameComponent', () => {
    let forwardGridOptions: GridOptions;
    let fixture: ComponentFixture<UserNameComponent>;
    let component: UserNameComponent;
    let userNameService: UserNameService;
    let modeController: ModeController;
    let querySpy: jasmine.Spy;

    function setupTestBed(modeContext: ModeContext) {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                UserNameModule
            ],
            providers: [
                { provide: ModeContext, useValue: modeContext },
                { provide: ModeController, useClass: FakeModeController }
            ]
        }).compileComponents();
    }

    function setupInstances() {
        fixture = TestBed.createComponent(UserNameComponent);
        component = fixture.componentInstance;
        userNameService = fixture.debugElement.injector.get(UserNameService);
        querySpy = spyOn(userNameService, 'query').and.returnValue(of(_.cloneDeep(forwardGridOptions)));
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

        describe('Master', () => {

            const fakeFilterModel = createUserNameFakeFilterModel(RoleId.Master, false);

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
                    const queryModel = args[0] as QueryModel;
                    expect(queryModel.title).toBe('Master Game Statistics Report From Nov 22, 2016 To Nov 22, 2016 (Base RM)');
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

                        it('should drill down to Agent', () => {
                            usernameElements[0].click();
                            expect(forwardSpy.calls.any()).toBeTruthy();
                            const args = forwardSpy.calls.mostRecent().args;
                            const modeContext = args[1] as ModeContext;
                            const expectedModeContext = ModeContext.create(
                                'DEPT01',
                                _.extend({}, fakeFilterModel, {
                                    userName: 'DEPT01',
                                    reportType: ReportType.UserName,
                                    roleId: RoleId.Master
                                }),
                                new UserNameGridModel(false, true)
                            );
                            expect(modeContext).toEqual(expectedModeContext);
                        });
                    });

                    describe('grand-total', () => {
                        let grandTotalElements: JQuery;

                        beforeEach(() => {
                            const hostElement = $(fixture.debugElement.nativeElement);
                            grandTotalElements = hostElement.find('a[grand-total]');
                        });

                        it('should have 1 grand-total elements', () => {
                            expect(grandTotalElements.length).toBe(1);
                        });

                        it('should invoke queryGrandTotal when clicking element', () => {
                            const fakeGrandTotalGridOptions: GridOptions = {
                                TitleInfoText: '123',
                                bodyRowHeight: undefined,
                                gridExpandHeight: undefined,
                                bodyRows: undefined,
                                columns: undefined,
                                customPager: undefined,
                                footerRows: undefined,
                                fullHeight: undefined,
                                gridHeight: undefined,
                                gridWidth: undefined,
                                pagerOption: undefined,
                                showTitle: true,
                                showTree: true,
                                showPager: true,
                                showHighlightRow: true,
                                titleInfo: undefined,
                                totalItems: undefined,
                                sortOption: undefined
                            };
                            // tslint:disable-next-line:max-line-length
                            const grandTotalSpy = spyOn(userNameService, 'queryGrandTotal').and.returnValue(of(fakeGrandTotalGridOptions));
                            const modalService = fixture.debugElement.injector.get(ModalService);
                            const modalSpy = spyOn(modalService, 'open').and.callFake(() => { });
                            grandTotalElements[0].click();
                            expect(grandTotalSpy.calls.any()).toBeTruthy();
                            let args = grandTotalSpy.calls.mostRecent().args;
                            const queryModel = args[0] as QueryModel;
                            expect(queryModel).not.toBe(fakeFilterModel);
                            expect(queryModel).toHaveMap({
                                isDrillDown: false,
                                isGrandTotal: true,
                                title: 'Grand Total By Currency From Nov 22, 2016 To Nov 22, 2016 (Base RM)'
                            });

                            expect(modalSpy.calls.any()).toBeTruthy();
                            args = modalSpy.calls.mostRecent().args;
                            expect(args[0]).toBe(GridModalComponent);
                            expect(fakeGrandTotalGridOptions).toHaveMap({
                                fullHeight: false,
                                gridHeight: 500,
                                titleInfo: {
                                    showExcelButton: true,
                                    text: '123'
                                }
                            });

                            // expect invoke queryExcel
                            const excelGrandTotalSpy = spyOn(userNameService, 'excelGrandTotal').and.returnValue(of(null));
                            const helperSpy = spyOn(Helper, 'downloadFile').and.callFake(() => { });
                            fakeGrandTotalGridOptions.titleInfo.exportExcelFunction();
                            args = helperSpy.calls.mostRecent().args;
                            const fileName = args[1] as string;
                            expect(fileName).toBe('Grand_Total_By_Currency_From_Nov_22_2016_To_Nov_22_2016.xls');
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
                            const queryModel = args[2] as UserNameQueryModel;
                            expect(queryModel).toHaveMap({
                                productId: '1,2',
                                username: 'DEPT01',
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
                                isNormalMode: false,
                                title: 'Associated Accounts With DEPT01 (Base RM)',
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
                    it('should return "Master Game Statistics Report From Nov 22, 2016 To Nov 22, 2016 (Base RM)" if last', () => {
                        const title = component.generateTitle(true);
                        expect(title).toBe('Master Game Statistics Report From Nov 22, 2016 To Nov 22, 2016 (Base RM)');
                    });

                    it('should return "Master" if not last', () => {
                        const title = component.generateTitle(false);
                        expect(title).toBe('Master');
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
                            const expectedColumnNames = ['ReportBy', 'ReportById', 'BetCount', 'Currency', 'TotalBets', 'GameIncome', 'GamePayout', 'HouseTurnover', 'HouseGrossIncome', 'HouseComm', 'ExtraPT', 'HouseNetIncome'];
                            expect(columnNames).toEqual(expectedColumnNames);
                        });

                        it('should invoke query when clicking on sort column', () => {
                            sortElements[0].click();
                            const args = querySpy.calls.mostRecent().args;
                            const queryModel = args[0] as QueryModel;
                            expect(queryModel).toHaveMap({
                                sortColumnName: 'ReportBy',
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
                            expect(fileName).toBe('Master_Game_Statistics_Report_From_Nov_22_2016_To_Nov_22_2016.xlsx');
                        });
                    });
                });
            });
        });

        describe('Agent', () => {
            const fakeFilterModel = createUserNameFakeFilterModel(RoleId.Agent, false);
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

                it('should drill down to Member', () => {
                    const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    const usernameElements = hostElement.find('a[drill-down-user-name]');
                    usernameElements[0].click();
                    expect(forwardSpy.calls.any()).toBeTruthy();
                    const args = forwardSpy.calls.mostRecent().args;
                    const modeContext = args[1] as ModeContext;
                    const expectedModeContext = ModeContext.create(
                        'DEPT01',
                        _.extend({}, fakeFilterModel, {
                            userName: 'DEPT01',
                            reportType: ReportType.UserName,
                            roleId: RoleId.Agent
                        }),
                        new UserNameGridModel(false, true)
                    );
                    expect(modeContext).toEqual(expectedModeContext);
                });
            });
        });

        describe('Member', () => {
            const fakeFilterModel = createUserNameFakeFilterModel(RoleId.Member, false);
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

                it('should drill down to Daily mode when click on user name', () => {
                    const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    const usernameElements = hostElement.find('a[drill-down-user-name]');
                    usernameElements[0].click();
                    expect(forwardSpy.calls.any()).toBeTruthy();
                    const args = forwardSpy.calls.mostRecent().args;
                    const modeContext = args[1] as ModeContext;
                    const expectedModeContext = ModeContext.create(
                        'DEPT01',
                        _.extend({}, fakeFilterModel, {
                            userName: 'DEPT01',
                            reportType: ReportType.Daily
                        }),
                        new DailyGridModel(false, true)
                    );
                    expect(modeContext).toEqual(expectedModeContext);
                });
            });
        });
    });

    describe('normal mode', () => {
        describe('Master', () => {
            const fakeFilterModel = createUserNameFakeFilterModel(RoleId.Master, true);
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

                it('should have 2 house-position-taking elements', () => {
                    expect(housePtElements.length).toBe(2);
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
                        custId: 4814135
                    });
                    const userName = args[1] as string;
                    expect(userName).toBe('SSK08');
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

                it('should have 2 associated-account elements', () => {
                    expect(associatedAccountElements.length).toBe(2);
                });

                it('should show associated-account when click on first element', () => {
                    const modalService = fixture.debugElement.injector.get(ModalService);
                    const modalSpy = spyOn(modalService, 'open').and.callFake(() => { });
                    associatedAccountElements[0].click();
                    expect(modalSpy.calls.any()).toBeTruthy();
                    const args = modalSpy.calls.mostRecent().args;
                    const queryModel = args[2] as UserNameQueryModel;
                    expect(queryModel).toHaveMap({
                        productId: '1,2',
                        username: 'SSK08',
                        site: '733333',
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
                        title: 'Associated Accounts With SSK08 (Base RM)',
                        isDrillDown: false,
                        isGrandTotal: false,
                        roleId: 0,
                        isBaseRM: true

                    });
                });
            });
        });

        describe('Member', () => {
            beforeEach(() => {
                forwardGridOptions = normalForwardGridOptions;
            });

            describe('filter with multiple products', () => {
                const fakeFilterModel = createUserNameFakeFilterModel(RoleId.Member, true);
                const fakeModeContext: ModeContext = {
                    filterModel: fakeFilterModel,
                    gridModel: fakeGridModel,
                    data: undefined,
                    label: undefined
                };
                let hostElement: JQuery;
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
            });

            describe('filter with single wallet product', () => {
                const fakeFilterModel = createUserNameFakeFilterModelWithSingleWalletProduct(RoleId.Member, true);
                const fakeModeContext: ModeContext = {
                    filterModel: fakeFilterModel,
                    gridModel: fakeGridModel,
                    data: undefined,
                    label: undefined
                };
                let hostElement: JQuery;
                let userNameElements: JQuery;

                beforeEach(fakeAsync(() => {
                    setupTestBed(fakeModeContext);
                    setupInstances();
                    fixture.detectChanges();
                    tick();
                    hostElement = $(fixture.debugElement.nativeElement);
                    userNameElements = hostElement.find('a[drill-down-user-name]');
                }));

                it('should have 2 user-name elements', () => {
                    expect(userNameElements.length).toBe(2);
                });

                it('should drill down to Hourly mode when click on user name', () => {
                    const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    userNameElements[0].click();
                    expect(forwardSpy.calls.any()).toBeTruthy();
                    const args = forwardSpy.calls.mostRecent().args;
                    const modeContext = args[1] as ModeContext;
                    const expectedModeContext = ModeContext.create(
                        'SSK08',
                        _.extend({}, fakeFilterModel, {
                            userName: 'SSK08',
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
