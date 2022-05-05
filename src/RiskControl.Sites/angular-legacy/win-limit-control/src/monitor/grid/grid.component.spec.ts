import { Component, DebugElement, Injectable } from '@angular/core';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';
import { PaginationService as NgxPaginationService, PaginatePipe } from 'ngx-pagination';
import { PaginationInstance, PaginationService } from 'nap-components/pagination';
import { PaginationConfig } from 'nap-components/pagination';
import { ToastService, MessageType } from 'nap-components/toast';
import { NgbDate } from 'nap-components/date';
import { ConfirmationService } from 'nap-components/confirmation';
import { LimitLevel } from '../../common/filter';
import { AuthorizationService } from '../../common/authorization';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { HistoryService } from '../history';
import { AccountService } from '../account';
import { Columns } from '../common/column';
import { GridComponent, GridService, UnblockCommand, GridModule, MonitorModel, AudioWrapper } from './index';
import { expect, Helper } from '../../testing';
import { fakeMonitorModels } from './grid.model.spec';

const fakeFilterModel: FilterModel = {
    fromDate: NgbDate.fromToday(),
    toDate: NgbDate.fromToday(),
    productId: 1,
    levelId: [102, 101, 1, 2, 3],
    userName: 'User1',
    siteId: 1,
    currencyId: 1,
    excludeTestData: true,
    columns: Columns
};

@Component({
    selector: 'nap-test',
    template: ''
})
class TestComponent {
    filterModel = fakeFilterModel;
}

let hasHostPermissionSpyCount = 0;
class AuthorizationServiceStub extends AuthorizationService {
    hasHostPermission(): Observable<boolean> {
        hasHostPermissionSpyCount++;
        return Observable.of(true);
    }
}

let playSpyCount = 0;
class AudioWrapperStub extends AudioWrapper {
    create(source: string): HTMLAudioElement {
        return new Audio();
    }

    play() {
        playSpyCount++;
    }
}

let querySpyCount = 0;
let fakeQueryFilterModel: FilterModel;
let unblockPlaceBetSpyCount = 0;
let unblockPlaceBetCommand: UnblockCommand;
let unblockTransferSpyCount = 0;
let unblockTransferCommand: UnblockCommand;
class GridServiceStub extends GridService {
    query(filterModel: FilterModel): Observable<MonitorModel[]> {
        querySpyCount++;
        fakeQueryFilterModel = filterModel;
        let result: MonitorModel[];
        switch (filterModel.productId) {
            case 1:
                result = [];
                break;
            case 2:
                result = fakeMonitorModels;
                break;
        }

        return Observable.of(result);
    }

    unblockPlaceBet(unblockCommand: UnblockCommand): Observable<CommandResult> {
        unblockPlaceBetSpyCount++;
        unblockPlaceBetCommand = unblockCommand;
        const commandResult: CommandResult = {
            ErrorCode: 0
        };
        return Observable.of(commandResult);
    }

    unblockTransfer(unblockCommand: UnblockCommand): Observable<CommandResult> {
        unblockTransferSpyCount++;
        unblockTransferCommand = unblockCommand;
        const commandResult: CommandResult = {
            ErrorCode: 0
        };
        return Observable.of(commandResult);
    }
}

function createTestComponent(template: string): ComponentFixture<TestComponent> {
    TestBed.overrideComponent(TestComponent, {
        set: {
            template: template
        }
    }).overrideComponent(GridComponent, {
        set: {
            providers: [
                { provide: AuthorizationService, useClass: AuthorizationServiceStub },
                { provide: GridService, useClass: GridServiceStub },
                { provide: AudioWrapper, useClass: AudioWrapperStub }
            ]
        }
    }).compileComponents();
    return TestBed.createComponent(TestComponent);
}

class Page {
    constructor(
        private fixture: ComponentFixture<TestComponent>
    ) { }

    get grid(): DebugElement {
        return this.fixture.debugElement.query(By.css('.grid'));
    }
}

describe('GridComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let page: Page;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                GridModule
            ],
            declarations: [
                TestComponent
            ]
        });
    });

    describe('no data binding', () => {
        beforeEach(() => {
            const template = '<nap-grid></nap-grid>';
            fixture = createTestComponent(template);
            page = new Page(fixture);
            fixture.detectChanges();
        });

        it('should invoke authorizationService on init', () => {
            expect(hasHostPermissionSpyCount).toBe(1);
        });

        it('should have no grid', () => {
            expect(page.grid).toBeNull();
        });
    });

    describe('data binding', () => {
        describe('Product 1 without data', () => {
            beforeEach(() => {
                querySpyCount = 0;
                fakeFilterModel.productId = 1;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                page = new Page(fixture);
                fixture.detectChanges();
            });

            it('should have grid', () => {
                expect(page.grid).not.toBeNull();
            });

            it('should display "There is no data"', () => {
                const bodyTable = fixture.debugElement.query(By.css('.grid .body'));
                expect(bodyTable.nativeElement.textContent.trim()).toBe('There is no data');
            });

            it('should invoke query with right parameters', () => {
                expect(querySpyCount).toBe(1);
                expect(fakeQueryFilterModel).toBe(fakeFilterModel);
            });

            it('should hide pagination', () => {
                const pagination = fixture.debugElement.queryAll(By.css('.test-pagination'));
                expect(pagination.length).toBe(0);
            });

            it('should not play sound', () => {
                expect(playSpyCount).toBe(0);
            });

            describe('Sound', () => {
                let soundIcon: DebugElement;

                beforeEach(() => {
                    const icons = fixture.debugElement.queryAll(By.css('.toolbox-item .fa'));
                    soundIcon = icons[icons.length - 1];
                });

                it('should enable sound by default', () => {
                    expect(soundIcon.nativeElement).toHaveCssClass('fa-volume-up');
                });

                describe('Toogle to disable sound', () => {
                    beforeEach(() => {
                        Helper.raiseClickEvent(soundIcon.nativeElement);
                        fixture.detectChanges();
                    });

                    it('should disable sound', () => {
                        expect(soundIcon.nativeElement).toHaveCssClass('fa-volume-off');
                    });
                });
            });

            describe('countdown', () => {
                let countdownElement: DebugElement;

                beforeEach(() => {
                    countdownElement = fixture.debugElement.query(By.css('nap-countdown-timer'));
                });

                it('should have right intervals', () => {
                    const intervalElements = countdownElement.queryAll(By.css('.countdown-intervals span'));
                    const contents = intervalElements.map(element => element.nativeElement.textContent.trim());
                    expect(contents).toEqual(['90 seconds', '120 seconds', '150 seconds', '180 seconds', 'Not Refresh']);
                });

                it('should have default interval "90"', () => {
                    const intervalElement = countdownElement.children[0];
                    expect(intervalElement.nativeElement.textContent.trim()).toBe('90');
                });

                it('should invoke query after clicking Refresh', () => {
                    querySpyCount = 0;
                    const refreshButton = countdownElement.children[1];
                    Helper.raiseClickEvent(refreshButton.nativeElement);
                    fixture.detectChanges();
                    expect(querySpyCount).toBe(1);
                });
            });
        });

        function expectRowContents(row: DebugElement, contents: string[]) {
            const cells = row.queryAll(By.css('td'));
            const cellContents = cells.map(cell => cell.nativeElement.textContent.trim());
            expect(cellContents).toEqual(contents);
        }

        describe('Product 2 with data', () => {
            let rows: DebugElement[];
            let toastActivateSpy: jasmine.Spy;
            let toastDeactivateSpy: jasmine.Spy;

            beforeEach(() => {
                querySpyCount = 0;
                playSpyCount = 0;
                fakeFilterModel.productId = 2;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                const toastService = fixture.debugElement.injector.get(ToastService);
                toastActivateSpy = spyOn(toastService, 'activate');
                toastDeactivateSpy = spyOn(toastService, 'deactivate');
                fixture.detectChanges();
                rows = fixture.debugElement.queryAll(By.css('.test-data-row'));
            });

            it('should invoke query with right parameters', () => {
                expect(querySpyCount).toBe(1);
                expect(fakeQueryFilterModel).toBe(fakeFilterModel);
            });

            it('should have 2 data rows', () => {
                expect(rows.length).toBe(2);
            });

            it('should play sound 1 time', () => {
                expect(playSpyCount).toBe(1);
            });

            it('should invoke alert message "Players have reached Company Limit setting. Please check again."', fakeAsync(() => {
                fixture.whenStable().then(() => {
                    expect(toastActivateSpy.calls.count()).toBe(1);
                    const args = toastActivateSpy.calls.mostRecent().args;
                    expect(args[0]).toBe('Players have reached Company Limit setting. Please check again.');
                    expect(args[1]).toBe(MessageType.Danger);
                });
            }));

            it('should hide alert message after 120 seconds', fakeAsync(() => {
                expect(toastDeactivateSpy.calls.count()).toBe(0);
                tick(120 * 1000);
                fixture.whenStable().then(() => {
                    expect(toastDeactivateSpy.calls.count()).toBe(1);
                });
            }));

            describe('Row 1', () => {
                let row: DebugElement;

                beforeEach(() => {
                    row = rows[0];
                });

                it('should have right contents', () => {
                    // tslint:disable-next-line:max-line-length
                    expectRowContents(row, ['1', 'User 1', 'Site 1', 'Currency 1', 'Product 1', 'Group 1', '1', '1', '1', '', '', '', '']);
                });

                it('should invoke to show "Account information" modal when clicking on username', () => {
                    const accountService = fixture.debugElement.injector.get(AccountService);
                    const accountServiceSpy = spyOn(accountService, 'show');
                    const cell = row.queryAll(By.css('.nap-link'))[0];
                    Helper.raiseClickEvent(cell.nativeElement);
                    fixture.detectChanges();
                    expect(accountServiceSpy.calls.any()).toBeTruthy();
                    const args = accountServiceSpy.calls.mostRecent().args;
                    expect(args[0]).toEqual(fakeMonitorModels[0]);
                });

                it('should invoke to show "History" modal when clicking on history column', () => {
                    const historyService = fixture.debugElement.injector.get(HistoryService);
                    const historyServiceSpy = spyOn(historyService, 'show');
                    const cell = row.query(By.css('.test-history-link'));
                    Helper.raiseClickEvent(cell.nativeElement);
                    fixture.detectChanges();
                    expect(historyServiceSpy.calls.any()).toBeTruthy();
                    const args = historyServiceSpy.calls.mostRecent().args;
                    expect(args[0]).toEqual(fakeMonitorModels[0]);
                });

                describe('Click on "Unblock Place Bet" checkbox"', () => {
                    let confirmationServiceSpy: jasmine.Spy;
                    let yesButton: HTMLElement;
                    let cancelButton: HTMLElement;

                    beforeEach(() => {
                        const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
                        confirmationServiceSpy = spyOn(confirmationService, 'openContent').and.callThrough();
                        const checkbox = row.queryAll(By.css('input'))[0];
                        Helper.raiseClickEvent(checkbox);
                        fixture.detectChanges();
                        yesButton = document.querySelector('.modal-footer .btn-primary') as HTMLElement;
                        cancelButton = document.querySelector('.modal-footer .btn-danger') as HTMLElement;
                    });

                    it('should display confirmation', () => {
                        expect(confirmationServiceSpy.calls.any()).toBeTruthy();
                        const args = confirmationServiceSpy.calls.mostRecent().args;
                        expect(args[0]).toBe('Are you sure you want to UnBlock player User 1 on Product 1 product?');
                    });

                    afterEach(() => {
                        Helper.raiseClickEvent(cancelButton);
                    });

                    describe('Click Yes on confirmation', () => {
                        beforeEach(() => {
                            unblockPlaceBetSpyCount = 0;
                            querySpyCount = 0;
                            Helper.raiseClickEvent(yesButton);
                            fixture.detectChanges();
                        });

                        it('should invoke unblockPlaceBet when click Yes on confirmation', fakeAsync(() => {
                            querySpyCount = 0;
                            fixture.whenStable().then(() => {
                                expect(unblockPlaceBetSpyCount).toBe(1);
                                const expectedUnblockCommand: UnblockCommand = {
                                    CustId: 1,
                                    GroupId: 1,
                                    ProductId: 1
                                };
                                expect(unblockPlaceBetCommand).toEqual(expectedUnblockCommand);
                                expect(querySpyCount).toBe(1);
                            });
                        }));
                    });

                    describe('Click No on confirmation', () => {
                        beforeEach(() => {
                            unblockPlaceBetSpyCount = 0;
                            Helper.raiseClickEvent(cancelButton);
                            fixture.detectChanges();
                        });

                        it('should not invoke unblockPlaceBet', () => {
                            fixture.whenStable().then(() => {
                                expect(unblockPlaceBetSpyCount).toBe(0);
                            });
                        });
                    });
                });

                describe('Click on "Unblock Transfer/Withdraw" checkbox"', () => {
                    let confirmationServiceSpy: jasmine.Spy;
                    let yesButton: HTMLElement;
                    let cancelButton: HTMLElement;

                    beforeEach(() => {
                        const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
                        confirmationServiceSpy = spyOn(confirmationService, 'openContent').and.callThrough();
                        const checkbox = row.queryAll(By.css('input'))[1];
                        Helper.raiseClickEvent(checkbox);
                        fixture.detectChanges();
                        yesButton = document.querySelector('.modal-footer .btn-primary') as HTMLElement;
                        cancelButton = document.querySelector('.modal-footer .btn-danger') as HTMLElement;
                    });

                    it('should display confirmation', () => {
                        expect(confirmationServiceSpy.calls.any()).toBeTruthy();
                        const args = confirmationServiceSpy.calls.mostRecent().args;
                        expect(args[0]).toBe('Are you sure you want to UnBlock player User 1 on Product 1 product?');
                    });

                    afterEach(() => {
                        Helper.raiseClickEvent(cancelButton);
                    });

                    describe('Click Yes on confirmation', () => {
                        beforeEach(() => {
                            unblockTransferSpyCount = 0;
                            Helper.raiseClickEvent(yesButton);
                            fixture.detectChanges();
                        });

                        it('should invoke unblockTransfer when click Yes on confirmation', fakeAsync(() => {
                            querySpyCount = 0;
                            fixture.whenStable().then(() => {
                                expect(unblockTransferSpyCount).toBe(1);
                                const expectedUnblockCommand: UnblockCommand = {
                                    CustId: 1,
                                    GroupId: 1,
                                    ProductId: 1
                                };
                                expect(unblockTransferCommand).toEqual(expectedUnblockCommand);
                                expect(querySpyCount).toBe(1);
                            });
                        }));
                    });

                    describe('Click No on confirmation', () => {
                        beforeEach(() => {
                            unblockTransferSpyCount = 0;
                            Helper.raiseClickEvent(cancelButton);
                            fixture.detectChanges();
                        });

                        it('should not invoke unblockTransfer', () => {
                            fixture.whenStable().then(() => {
                                expect(unblockTransferSpyCount).toBe(0);
                            });
                        });
                    });
                });
            });

            describe('Row 2', () => {
                let row: DebugElement;

                beforeEach(() => {
                    row = rows[1];
                });

                it('should have right contents', () => {
                    // tslint:disable-next-line:max-line-length
                    expectRowContents(row, ['2', 'User 2', 'Site 2', 'Currency 2', 'Product 2', 'Group 2', '2', '2', '2', '(2)', '', '', '']);
                });
            });
        });

        describe('Show loss limit columns', () => {
            let row: DebugElement;

            beforeEach(() => {
                querySpyCount = 0;
                fakeFilterModel.productId = 2;
                const columns = _.cloneDeep(Columns);
                columns.lossLimitLevel.checked = true;
                fakeFilterModel.columns = columns;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                const rows = fixture.debugElement.queryAll(By.css('.test-data-row'));
                row = rows[0];
            });

            it('should show row 1 with right contents', () => {
                // tslint:disable-next-line:max-line-length
                expectRowContents(row, ['1', 'User 1', 'Site 1', 'Currency 1', 'Product 1', 'Group 1', '-1', '-1', '1', '1', '1', '', '', '', '']);
            });
        });

        describe('Show win limit columns', () => {
            let row: DebugElement;

            beforeEach(() => {
                querySpyCount = 0;
                fakeFilterModel.productId = 2;
                const columns = _.cloneDeep(Columns);
                columns.winLimitLevel.checked = true;
                fakeFilterModel.columns = columns;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                const rows = fixture.debugElement.queryAll(By.css('.test-data-row'));
                row = rows[0];
            });

            it('should show row 1 with right contents', () => {
                // tslint:disable-next-line:max-line-length
                expectRowContents(row, ['1', 'User 1', 'Site 1', 'Currency 1', 'Product 1', 'Group 1', '1', '1', '1', '1', '1', '1', '', '', '', '']);
            });
        });

        describe('Show both loss & win limit columns', () => {
            let row: DebugElement;

            beforeEach(() => {
                querySpyCount = 0;
                fakeFilterModel.productId = 2;
                const columns = _.cloneDeep(Columns);
                columns.lossLimitLevel.checked = true;
                columns.winLimitLevel.checked = true;
                fakeFilterModel.columns = columns;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                const rows = fixture.debugElement.queryAll(By.css('.test-data-row'));
                row = rows[0];
            });

            it('should show row 1 with right contents', () => {
                // tslint:disable-next-line:max-line-length
                expectRowContents(row, ['1', 'User 1', 'Site 1', 'Currency 1', 'Product 1', 'Group 1', '-1', '-1', '1', '1', '1', '1', '1', '1', '', '', '', '']);
            });
        });
    });
});
