import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { HttpService, HttpModule as NapHttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
import { GridModalComponent } from 'components/grid-modal';
import { ReportType } from '../../filter';
import { QueryModel } from '../../app.model';
import { ModeContext, GridModel, ModeController } from '../index';
import { HourlyData, HourlyService, HourlyComponent, HourlyModule } from './index';
import { FakeModeController } from '../mocks/mode-controller.spec';
import { createFakeFilterModel } from '../mocks/filter-model.spec';
import { fakeGridModel } from '../mocks/grid-model.spec';
import { expect } from '../../../testing';

const fakeFilterModel = createFakeFilterModel(ReportType.Hourly);
const fakeData: HourlyData = require('./mocks/fake-data.json');

describe('HourlyComponent', () => {

    let fixture: ComponentFixture<HourlyComponent>;
    let component: HourlyComponent;
    let hourlyService: HourlyService;
    let modeController: ModeController;
    let querySpy: jasmine.Spy;

    function queryTextContents(elements: DebugElement[]): string[] {
        return elements.map(element => element.nativeElement.textContent.trim());
    }

    function setupTestBed(modeContext: ModeContext) {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                HourlyModule
            ],
            providers: [
                { provide: ModeContext, useValue: modeContext },
                { provide: ModeController, useClass: FakeModeController }
            ]
        }).compileComponents();
    }

    function setupInstances() {
        fixture = TestBed.createComponent(HourlyComponent);
        component = fixture.componentInstance;
        hourlyService = fixture.debugElement.injector.get(HourlyService);
        querySpy = spyOn(hourlyService, 'query').and.returnValue(of(fakeData));
        modeController = fixture.debugElement.injector.get(ModeController);
    }

    beforeEach(fakeAsync(() => {
        const fakeModeContext = {
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

    it('should invoke query when initialzing', () => {
        fixture.detectChanges();
        expect(querySpy.calls.any()).toBeTruthy();
        const args = querySpy.calls.mostRecent().args;
        const queryModel = args[0] as QueryModel;
        expect(queryModel.title).toBe('Hourly Game Statistics Report On Nov 22, 2016 (Base RM)');
    });

    it('should return "Accumulated Hourly Statistics Record on Nov 22, 2016 (GMT+8)" when invoking generateTitle', () => {
        const title = component.generateTitle();
        expect(title).toBe('Accumulated Hourly Statistics Record on Nov 22, 2016 (GMT+8)');
    });

    describe('tables', () => {
        // tslint:disable-next-line:max-line-length
        const expectedColumnNames = ['Time', 'Online Players', 'Bet Count', 'Currency', 'Total Bets', 'Game Income', 'Game Payout', 'Turnover', 'Real Turnover', 'Gross Income', 'Comm', 'ExtraPT', 'Net Income'];
        let tables: DebugElement[];

        beforeEach(() => {
            fixture.detectChanges();
            tables = fixture.debugElement.queryAll(By.css('table'));
        });

        it('should display 2 tables', () => {
            expect(tables.length).toBe(2);
        });

        describe('accumulated statistics records', () => {
            let rows: DebugElement[];
            let averageCell: DebugElement;

            beforeEach(() => {
                fixture.detectChanges();
                rows = tables[0].queryAll(By.css('tbody tr'));
                averageCell = tables[0].queryAll(By.css('.average th'))[1];
            });

            it('should display 13 columns', () => {
                const columns = tables[0].queryAll(By.css('thead th'));
                expect(columns.length).toBe(13);
                const columnNames = queryTextContents(columns);
                expect(columnNames).toEqual(expectedColumnNames);
            });

            it('should display 3 rows', () => {
                expect(rows.length).toBe(3);
            });

            it('should display average "1,211"', () => {
                expect(averageCell.nativeElement).toHaveTrimmedText('1,211');
            });

            describe('first row', () => {
                let row: DebugElement;
                let cells: DebugElement[];

                beforeEach(() => {
                    row = rows[0];
                    cells = row.queryAll(By.css('td'));
                });

                it('should display content as expected', () => {
                    const expectedContents = ['13:00', '1', '2', 'RM', '61', '33.02', '46.21%', '6.14', '6.14', '3.30', '1.00', '1.00', '3.30'];
                    const contents = queryTextContents(cells);
                    expect(contents).toEqual(expectedContents);
                });

                it('should display class "number-positive" on column "Comm"', () => {
                    const cell = cells[10];
                    expect(cell.nativeElement).toHaveCssClass('number-positive');
                });
            });

            describe('second row', () => {
                let row: DebugElement;
                let cells: DebugElement[];

                beforeEach(() => {
                    row = rows[1];
                    cells = row.queryAll(By.css('td'));
                });

                it('should display content as expected', () => {
                    const expectedContents = ['14:00', '', '', '', '', '', '', '', '', '', '', '', ''];
                    const contents = queryTextContents(cells);
                    expect(contents).toEqual(expectedContents);
                });
            });

            describe('third row', () => {
                let row: DebugElement;
                let cells: DebugElement[];

                beforeEach(() => {
                    row = rows[2];
                    cells = row.queryAll(By.css('td'));
                });

                it('should display content as expected', () => {
                    // tslint:disable-next-line:max-line-length
                    const expectedContents = ['15:00', '1,111', '2,111', 'RM', '61', '-33.02', '146.21%', '6.14', '6.14', '-3.30', '1.00', '2.00', '-3.30'];
                    const contents = queryTextContents(cells);
                    expect(contents).toEqual(expectedContents);
                });

                it('should display class "highlight" & "number-positive" on column "Game Payout"', () => {
                    const cell = cells[6];
                    expect(cell.nativeElement).toHaveCssClass('highlight');
                    expect(cell.nativeElement).toHaveCssClass('number-positive');
                });

                it('should display class "number-negative" on column indexes 5, 9, 12', () => {
                    const indexes = [5, 9, 12];
                    indexes.forEach(index => {
                        expect(cells[index].nativeElement).toHaveCssClass('number-negative');
                    });
                });

                it('should display class "number-positive" on column "Comm"', () => {
                    const cell = cells[10];
                    expect(cell.nativeElement).toHaveCssClass('number-positive');
                });
            });
        });

        describe('hourly statistics records', () => {
            let rows: DebugElement[];

            beforeEach(() => {
                fixture.detectChanges();
                rows = tables[1].queryAll(By.css('tbody tr'));
            });

            it('should display 13 columns', () => {
                const columns = tables[0].queryAll(By.css('thead th'));
                expect(columns.length).toBe(13);
                const columnNames = queryTextContents(columns);
                expect(columnNames).toEqual(expectedColumnNames);
            });

            it('should display 2 rows', () => {
                expect(rows.length).toBe(2);
            });
        });
    });

    describe('breadcrumb', () => {
        let spy: jasmine.Spy;
        let breadcrumbs: DebugElement[];

        beforeEach(() => {
            const fakeBreadcrumbItems: string[] = ['Item1', 'Item2'];
            spyOn(modeController, 'generateBreadcrumbItems').and.returnValues(fakeBreadcrumbItems);
            fixture.detectChanges();
            spy = spyOn(modeController, 'goBack').and.callThrough();
            breadcrumbs = fixture.debugElement.queryAll(By.css('nap-breadcrumb'));
        });

        it('should have 2 breadcrumbs', () => {
            expect(breadcrumbs.length).toBe(2);
        });

        it('should invoke goBack when clicking on first item of first breadcrumb', () => {
            const item = breadcrumbs[0].query(By.css('.breadcrumb-item .nap-link'));
            item.nativeElement.click();
            fixture.detectChanges();
            expect(spy.calls.any()).toBeTruthy();
        });

        it('should display only one item in second breadcrumb with content "Hourly Statistics Record on Nov 22, 2016 (GMT+8)"', () => {
            const items = breadcrumbs[1].queryAll(By.css('.breadcrumb-item'));
            expect(items.length).toBe(1);
            expect(items[0].nativeElement).toHaveTrimmedText('Hourly Statistics Record on Nov 22, 2016 (GMT+8)');
        });

        it('should invoke export excel when clicking on icon', () => {
            const excelSpy = spyOn(hourlyService, 'excel').and.returnValue(of({}));
            const helperSpy = spyOn(Helper, 'downloadFile').and.callFake(() => { });
            const excelIcon = breadcrumbs[0].query(By.css('.nap-icon-breadcrumb-excel'));
            excelIcon.nativeElement.click();
            fixture.detectChanges();
            expect(excelSpy.calls.any()).toBeTruthy();
            let args = excelSpy.calls.mostRecent().args;
            const queryModel = args[0];
            expect(queryModel).toHaveMap({
                reportBy: 'Hourly',
                title: 'Hourly Game Statistics Report On Nov 22, 2016 (Base RM)'
            });
            expect(helperSpy.calls.any()).toBeTruthy();
            args = helperSpy.calls.mostRecent().args;
            const fileName = args[1];
            expect(fileName).toBe('Product_1_Hourly_Report_On_Nov_22_2016.xlsx');
        });
    });
});
