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
import { ReportType } from '../../filter';
import { GrandTotalService } from '../common';
import { HourlyGridModel } from '../hourly';
import { QueryModel } from '../../app.model';
import { ModeContext, ModeController } from '../index';
import { DailyService, DailyComponent, DailyModule, DailyGridModel, DailyQueryModel } from './index';
import { FakeModeController } from '../mocks/mode-controller.spec';
import { createFakeFilterModel, createFakeFilterModelWithSingleWalletProduct } from '../mocks/filter-model.spec';
import { fakeGridModel } from '../mocks/grid-model.spec';
import { expect } from '../../../testing';

const fakeFilterModel = createFakeFilterModel(ReportType.Daily);
const fakeFilterModelWithSingleWalletProduct = createFakeFilterModelWithSingleWalletProduct(ReportType.Daily);
const forwardGridOptions = require('./mocks/forward-grid-options.json');
const backGridOptions = require('./mocks/back-grid-options.json');

describe('DailyComponent', () => {

    let fixture: ComponentFixture<DailyComponent>;
    let component: DailyComponent;
    let dailyService: DailyService;
    let modeController: ModeController;
    let querySpy: jasmine.Spy;

    function setupTestBed(modeContext: ModeContext) {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                DailyModule
            ],
            providers: [
                { provide: ModeContext, useValue: modeContext },
                { provide: ModeController, useClass: FakeModeController }
            ]
        }).compileComponents();
    }

    function setupInstances() {
        fixture = TestBed.createComponent(DailyComponent);
        component = fixture.componentInstance;
        dailyService = fixture.debugElement.injector.get(DailyService);
        querySpy = spyOn(dailyService, 'query').and.returnValue(of(_.cloneDeep(forwardGridOptions)));
        modeController = fixture.debugElement.injector.get(ModeController);
    }

    function expectGridOptions(gridOption: GridOptions, expectedGridOptions: GridOptions) {
        gridOption.gridExpandHeight = undefined;
        expectedGridOptions.gridExpandHeight = undefined;
        expect(JSON.stringify(gridOption)).toBe(JSON.stringify(expectedGridOptions));
    }

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
            expect(queryModel.title).toBe('Daily Game Statistics Report On Nov 22, 2016 (Base RM)');
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
                expectGridOptions(gridOptions, backGridOptions);
            });

            describe('drill-down currency', () => {
                let forwardSpy: jasmine.Spy;
                let currencyElements: JQuery;

                beforeEach(() => {
                    forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    const hostElement = $(fixture.debugElement.nativeElement);
                    currencyElements = hostElement.find('a[drill-down-currency]');
                });

                it('should have no currency elements', () => {
                    expect(currencyElements.length).toBe(2);
                });

                it('should drill down to currency on "Jun 13, 2017" when click on first element', () => {
                    currencyElements[0].click();
                    expect(forwardSpy.calls.any()).toBeTruthy();
                    const args = forwardSpy.calls.mostRecent().args;
                    const modeContext = args[1] as ModeContext;
                    const filterModel = _.cloneDeep(fakeFilterModel);
                    filterModel.startDate = moment.utc('2017-06-13', 'YYYY-MM-DD');
                    filterModel.endDate = moment.utc('2017-06-13', 'YYYY-MM-DD');
                    const expectedModeContext = ModeContext.create(
                        'Jun 13, 2017',
                        filterModel,
                        new DailyGridModel(true, false)
                    );
                    expect(JSON.stringify(modeContext)).toBe(JSON.stringify(expectedModeContext));
                });
            });

            describe('drill-down hourly', () => {
                let forwardSpy: jasmine.Spy;
                let hourlyElements: JQuery;

                beforeEach(() => {
                    forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                    const hostElement = $(fixture.debugElement.nativeElement);
                    hourlyElements = hostElement.find('a[drill-down-hourly]');
                });

                it('should have no hourly elements', () => {
                    expect(hourlyElements.length).toBe(0);
                });
            });
        });
    });

    describe('filter with single wallet product', () => {
        beforeEach(fakeAsync(() => {
            const fakeModeContext: ModeContext = {
                filterModel: fakeFilterModelWithSingleWalletProduct,
                gridModel: new DailyGridModel(false, true),
                data: undefined,
                label: undefined
            };
            setupTestBed(fakeModeContext);
            setupInstances();
            fixture.detectChanges();
            tick();
        }));

        beforeEach(() => {
            setupInstances();
        });

        describe('drill-down hourly', () => {
            let forwardSpy: jasmine.Spy;
            let hourlyElements: JQuery;

            beforeEach(fakeAsync(() => {
                fixture.detectChanges();
                tick();
            }));

            beforeEach(() => {
                forwardSpy = spyOn(modeController, 'forward').and.callThrough();
                const hostElement = $(fixture.debugElement.nativeElement);
                hourlyElements = hostElement.find('a[drill-down-hourly]');
            });

            it('should have 2 hourly elements', () => {
                expect(hourlyElements.length).toBe(2);
            });

            it('should drill down to hourly on "Jun 13, 2017" when click on first element', () => {
                hourlyElements[0].click();
                expect(forwardSpy.calls.any()).toBeTruthy();
                const args = forwardSpy.calls.mostRecent().args;
                const modeContext = args[1] as ModeContext;
                const filterModel = _.cloneDeep(fakeFilterModelWithSingleWalletProduct);
                filterModel.reportType = ReportType.Hourly;
                filterModel.startDate = moment.utc('2017-06-13', 'YYYY-MM-DD');
                filterModel.endDate = moment.utc('2017-06-13', 'YYYY-MM-DD');
                const expectedModeContext = ModeContext.create(
                    'Jun 13, 2017',
                    filterModel,
                    new HourlyGridModel(false, true)
                );
                expect(JSON.stringify(modeContext)).toBe(JSON.stringify(expectedModeContext));
            });
        });
    });

    describe('back', () => {
        beforeEach(waitForAsync(() => {
            const fakeModeContext = {
                filterModel: fakeFilterModel,
                gridModel: fakeGridModel,
                data: backGridOptions,
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
            expectGridOptions(component.gridOptions, backGridOptions);
        });

        describe('generateTitle', () => {
            it('should return "Daily Game Statistics Report On Nov 22, 2016 (Base RM)" if last', () => {
                const title = component.generateTitle(true);
                expect(title).toBe('Daily Game Statistics Report On Nov 22, 2016 (Base RM)');
            });

            it('should return "Daily" if not last', () => {
                const title = component.generateTitle(false);
                expect(title).toBe('Daily');
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

                it('should support sorting on all columns', () => {
                    expect(sortElements.length).toBe(12);
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
                    const excelSpy = spyOn(dailyService, 'excel').and.returnValue(of(null));
                    const helperSpy = spyOn(Helper, 'downloadFile').and.callFake(() => { });
                    const excelButton = hostElement.find('.btnExcel');
                    excelButton.click();
                    expect(excelSpy.calls.any()).toBeTruthy();
                    const args = helperSpy.calls.mostRecent().args;
                    const fileName = args[1] as string;
                    expect(fileName).toBe('Daily_Game_Statistics_Report_On_Nov_22_2016.xls');
                });
            });

            describe('grand-total', () => {
                let grandTotalElements: JQuery;

                beforeEach(fakeAsync(() => {
                    fixture.detectChanges();
                    tick();
                }));

                beforeEach(() => {
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
                    const grandTotalService = fixture.debugElement.injector.get(GrandTotalService);
                    const grandTotalSpy = spyOn(grandTotalService, 'query').and.returnValue(of(fakeGrandTotalGridOptions));
                    const modalService = fixture.debugElement.injector.get(ModalService);
                    const modalSpy = spyOn(modalService, 'open').and.callFake(() => { });
                    grandTotalElements[0].click();
                    expect(grandTotalSpy.calls.any()).toBeTruthy();
                    let args = grandTotalSpy.calls.mostRecent().args;
                    expect(args[0]).toBe(ReportType.Daily);
                    const queryModel = args[1] as QueryModel;
                    expect(queryModel).not.toBe(fakeFilterModel);
                    expect(queryModel).toHaveMap({
                        isDrillDown: true,
                        isGrandTotal: true,
                        title: 'Grand Total By Currency On Nov 22, 2016 (Base RM)'
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
                    const excelGrandTotalSpy = spyOn(grandTotalService, 'excel').and.returnValue(of(null));
                    const helperSpy = spyOn(Helper, 'downloadFile').and.callFake(() => { });
                    fakeGrandTotalGridOptions.titleInfo.exportExcelFunction();
                    expect(excelGrandTotalSpy.calls.any()).toBeTruthy();
                    args = excelGrandTotalSpy.calls.mostRecent().args;
                    expect(args[0]).toBe(ReportType.Daily);
                    args = helperSpy.calls.mostRecent().args;
                    const fileName = args[1] as string;
                    expect(fileName).toBe('Grand_Total_By_Currency_On_Nov_22_2016.xls');
                });
            });
        });
    });

    describe('drill-down from daily', () => {
        beforeEach(fakeAsync(() => {
            const fakeModeContext = {
                filterModel: fakeFilterModel,
                gridModel: new DailyGridModel(true, false),
                data: undefined,
                label: undefined
            };
            setupTestBed(fakeModeContext);
            setupInstances();
            fixture.detectChanges();
            tick();
        }));

        it('should have query model with field usernameDrillDown=false', () => {
            expect(querySpy.calls.any()).toBeTruthy();
            const args = querySpy.calls.mostRecent().args;
            const queryModel = args[0] as DailyQueryModel;
            expect(queryModel.usernameDrillDown).toBeFalsy();
        });

        it('should not have drill-down on grand total', () => {
            const hostElement = $(fixture.debugElement.nativeElement);
            const grandTotalElements = hostElement.find('a[grand-total]');
            expect(grandTotalElements.length).toBe(0);
        });
    });

    describe('drill-down from user-name', () => {
        beforeEach(fakeAsync(() => {
            const fakeModeContext = {
                filterModel: fakeFilterModel,
                gridModel: new DailyGridModel(false, true),
                data: undefined,
                label: undefined
            };
            setupTestBed(fakeModeContext);
            setupInstances();
            fixture.detectChanges();
            tick();
        }));

        it('should have query model with field usernameDrillDown=true', () => {
            expect(querySpy.calls.any()).toBeTruthy();
            const args = querySpy.calls.mostRecent().args;
            const queryModel = args[0] as DailyQueryModel;
            expect(queryModel.usernameDrillDown).toBeTruthy();
        });

        it('should allown to drill-down on grand total', () => {
            const hostElement = $(fixture.debugElement.nativeElement);
            const grandTotalElements = hostElement.find('a[grand-total]');
            expect(grandTotalElements.length).toBe(1);
            const grandTotalService = fixture.debugElement.injector.get(GrandTotalService);
            const grandTotalSpy = spyOn(grandTotalService, 'query').and.returnValue(of({}));
            const modalService = fixture.debugElement.injector.get(ModalService);
            const modalSpy = spyOn(modalService, 'open').and.callFake(() => { });
            grandTotalElements[0].click();
            expect(grandTotalSpy.calls.any()).toBeTruthy();
            const queryModel = grandTotalSpy.calls.mostRecent().args[1] as QueryModel;
            expect(queryModel.isDrillDown).toBeFalsy();
        });

        it('should allow to drill-down to currency', () => {
            const forwardSpy = spyOn(modeController, 'forward').and.callThrough();
            const hostElement = $(fixture.debugElement.nativeElement);
            const currencyElements = hostElement.find('a[drill-down-currency]');
            currencyElements[0].click();
            expect(forwardSpy.calls.any()).toBeTruthy();
            const args = forwardSpy.calls.mostRecent().args;
            const modeContext = args[1] as ModeContext;
            const filterModel = _.cloneDeep(fakeFilterModel);
            filterModel.startDate = moment.utc('2017-06-13', 'YYYY-MM-DD');
            filterModel.endDate = moment.utc('2017-06-13', 'YYYY-MM-DD');
            const expectedModeContext = ModeContext.create(
                'Jun 13, 2017',
                filterModel,
                new DailyGridModel(true, true)
            );
            expect(JSON.stringify(modeContext)).toBe(JSON.stringify(expectedModeContext));
        });
    });
});
