import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Component, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';
import { ConfirmationService } from 'nap-components/confirmation';
import { ToastService, MessageType } from 'nap-components/toast';
import { AuthorizationService } from '../../../services/authorization.service';
import { GroupSettingService } from '../../common/group-setting';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { InsertService } from '../insert';
import { Helper as CommonHelper } from '../common';
import { GridModule, GridComponent, GridService, PlayerCurrencySetting, DeleteCommand, UpdateCommand } from './index';
import { fakePlayerCurrencySettings } from './grid.model.spec';
import { expect, Helper } from '../../../testing';

const fakeFilterModel: FilterModel = {
    userName: 'User1',
    productId: 1,
    currencyId: 1,
    siteId: 1
};

@Component({
    selector: 'nap-test',
    template: ''
})
class TestComponent {
    filterModel = fakeFilterModel;
}

let hostPermission = true;
let hasHostPermissionSpyCount = 0;
class AuthorizationServiceStub extends AuthorizationService {
    hasHostPermission(): Observable<boolean> {
        hasHostPermissionSpyCount++;
        return Observable.of(hostPermission);
    }
}

let fakeQueryFilterModel: FilterModel;
let querySpyCount = 0;
let deleteSpyCount = 0;
let deleteErrorCode = 0;
let updateSpyCount = 0;
let updateErrorCode = 0;
class GridServiceStub extends GridService {
    query(filterModel: FilterModel): Observable<PlayerCurrencySetting[]> {
        querySpyCount++;
        fakeQueryFilterModel = filterModel;
        let playerCurrencySettings: PlayerCurrencySetting[] = [];
        switch (filterModel.productId) {
            case 1:
                playerCurrencySettings = [];
                break;
            case 2:
                playerCurrencySettings = _.cloneDeep(fakePlayerCurrencySettings);
                CommonHelper.calculateSettingCountForCurrencyGroup(playerCurrencySettings);
                break;
        }

        return Observable.of(playerCurrencySettings);
    }

    delete(deleteCommand: DeleteCommand): Observable<CommandResult> {
        deleteSpyCount++;
        const commandResult: CommandResult = {
            ErrorCode: deleteErrorCode
        };
        return Observable.of(commandResult);
    }

    update(updateCommand: UpdateCommand): Observable<CommandResult> {
        updateSpyCount++;
        const commandResult: CommandResult = {
            ErrorCode: updateErrorCode
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
                { provide: GridService, useClass: GridServiceStub }
            ]
        }
    }).compileComponents();
    return TestBed.createComponent(TestComponent);
}

describe('GridComponent', () => {
    let fixture: ComponentFixture<TestComponent>;

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
        beforeEach(fakeAsync(() => {
            const template = '<nap-grid></nap-grid>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            tick();
        }));

        it('should invoke authorizationService on init', () => {
            expect(hasHostPermissionSpyCount).toBe(1);
        });

        it('should have no grid', () => {
            const gridElement = fixture.debugElement.query(By.css('.grid'));
            expect(gridElement).toBeNull();
        });
    });

    describe('data binding', () => {
        function testRow(row: DebugElement, expectedContents: string[]) {
            const cells = row.queryAll(By.css('td'));
            const textCells = cells.slice(0, expectedContents.length - 6);
            const limitCells = cells.slice(expectedContents.length - 6);
            const textContents = textCells.map(cell => cell.nativeElement.textContent.trim());
            const limitContents = limitCells.map(cell => {
                const spanElements = cell.queryAll(By.css('span'));
                return spanElements.map(span => span.nativeElement.textContent.trim()).join('');
            });
            expect(textContents.concat(limitContents)).toEqual(expectedContents);
        }

        describe('Product 1 without data', () => {
            beforeEach(fakeAsync(() => {
                fakeFilterModel.productId = 1;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                tick();
            }));

            it('should have grid', () => {
                const gridElement = fixture.debugElement.query(By.css('.grid'));
                expect(gridElement).not.toBeNull();
            });

            it('should display "There is no data"', () => {
                const bodyTable = fixture.debugElement.query(By.css('.grid .body'));
                expect(bodyTable.nativeElement.textContent.trim()).toBe('There is no data');
            });

            it('should invoke query with right parameters', () => {
                expect(fakeQueryFilterModel).toBe(fakeFilterModel);
            });

            describe('Show Add Player', () => {
                let insertServiceSpy: jasmine.Spy;

                beforeEach(fakeAsync(() => {
                    querySpyCount = 0;
                    const insertService = fixture.debugElement.injector.get(InsertService);
                    insertServiceSpy = spyOn(insertService, 'show').and.callThrough();
                    const addIcon = fixture.debugElement.query(By.css('.breadcrumb-toolbox .fa-plus-circle'));
                    Helper.raiseClickEvent(addIcon.nativeElement);
                    fixture.detectChanges();
                    tick();
                }));

                it('should show "add player" modal', () => {
                    expect(insertServiceSpy.calls.any()).toBeTruthy();
                });

                afterEach(() => {
                    const closeButton = document.querySelector('.modal-dialog .close') as HTMLElement;
                    Helper.raiseClickEvent(closeButton);
                });
            });
        });

        describe('Product 2 with data and not have host permission', () => {
            beforeEach(fakeAsync(() => {
                hostPermission = false;
                querySpyCount = 0;
                fakeFilterModel.productId = 2;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                tick();
            }));

            it('should not have icon "Add Player"', () => {
                const addIcon = fixture.debugElement.query(By.css('.breadcrumb-toolbox .fa-plus-circle'));
                expect(addIcon).toBeNull();
            });

            it('should not have column "Delete"', () => {
                const deleteIcons = fixture.debugElement.queryAll(By.css('.grid .body .fa-times'));
                expect(deleteIcons.length).toBe(0);
            });

            it('should not have permission to edit limits', () => {
                const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                rows.forEach(row => {
                    const cells = row.queryAll(By.css('td'));
                    for (let i = cells.length - 5; i < cells.length; i++) {
                        const links = cells[i].queryAll(By.css('.nap-link'));
                        expect(links.length).toBe(0);
                    }
                });
            });
        });

        describe('Product 2 with data and have host permission', () => {
            beforeEach(fakeAsync(() => {
                hostPermission = true;
                querySpyCount = 0;
                fakeFilterModel.productId = 2;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                tick();
            }));

            it('should invoke query with right parameters', () => {
                expect(querySpyCount).toBe(1);
                expect(fakeQueryFilterModel).toBe(fakeFilterModel);
            });

            function expectToDisplayOriginalBodyData() {
                const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                // tslint:disable-next-line:max-line-length
                testRow(rows[0], ['1', 'User1', 'Site 1', 'Currency 1', 'Product 1', 'Group 1', '-2(RM)', '-1(RM)', '1(RM)', '2(RM)', '3(RM)', '']);
                testRow(rows[1], ['Group 2', '-1,234(RM)', '-123(RM)', '123(RM)', '1,234(RM)', '12,345(RM)', '']);
                testRow(rows[2], ['Product 2', 'Group 3', '-2(RM)', '0(RM)', '1(RM)', '0(RM)', '3(RM)', '']);
                // tslint:disable-next-line:max-line-length
                testRow(rows[3], ['2', 'User2', 'Site 2', 'Currency 2', 'Product 3', 'Group 3', '-1,234,567(RM)', '0(RM)', '1(RM)', '0(RM)', '123,456,789(RM)', '']);
            }

            it('should display data', () => {
                expectToDisplayOriginalBodyData();
            });

            describe('Show Group Setting', () => {
                let groupSettingServiceSpy: jasmine.Spy;

                beforeEach(fakeAsync(() => {
                    const groupSettingService = fixture.debugElement.injector.get(GroupSettingService);
                    groupSettingServiceSpy = spyOn(groupSettingService, 'show');
                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    const link = rows[0].query(By.css('.nap-link'));
                    Helper.raiseClickEvent(link);
                }));

                it('should show group setting modal with "Product 1"', () => {
                    expect(groupSettingServiceSpy.calls.any()).toBeTruthy();
                    const args = groupSettingServiceSpy.calls.mostRecent().args;
                    expect(args[0]).toBe('Product 1');
                });
            });

            describe('Editing first row', () => {
                let row: DebugElement;
                let confirmationServiceSpy: jasmine.Spy;

                beforeEach(() => {
                    const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
                    confirmationServiceSpy = spyOn(confirmationService, 'openContent').and.callThrough();
                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    row = rows[0];
                });

                describe('Editing black level', () => {
                    let cell: DebugElement;
                    let span: DebugElement;
                    let input: DebugElement;

                    beforeEach(fakeAsync(() => {
                        const cells = row.queryAll(By.css('td'));
                        cell = cells[6];
                        span = cell.query(By.css('.nap-link'));
                        input = cell.query(By.css('input'));
                        Helper.raiseClickEvent(span.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should hide span', () => {
                        expect(span.nativeElement.hidden).toBeTruthy();
                    });

                    it('should display textbox with value "-2"', () => {
                        expect(input.nativeElement.value).toBe('-2');
                    });

                    describe('Accept new value "-3"', () => {
                        let yesButton: HTMLElement;
                        let cancelButton: HTMLElement;

                        beforeEach(fakeAsync(() => {
                            Helper.raiseInputEvent(input.nativeElement, '-3');
                            input.triggerEventHandler('keydown', {
                                which: 13
                            });
                            fixture.detectChanges();
                            tick();
                            yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                            cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                        }));

                        it('should display span with text "-3"', () => {
                            expect(span.nativeElement.hidden).toBeFalsy();
                            expect(span.nativeElement.textContent.trim()).toBe('-3');
                        });

                        it('should invoke confirmation with message "Are you sure want to change setting of User1?"', () => {
                            expect(confirmationServiceSpy.calls.any()).toBeTruthy();
                            const args = confirmationServiceSpy.calls.mostRecent().args;
                            expect(args[0]).toBe('Are you sure want to change setting of User1?');
                        });

                        afterEach(() => {
                            Helper.raiseClickEvent(cancelButton);
                        });

                        describe('Click Yes on confirmation', () => {
                            let toastServiceSpy: jasmine.Spy;

                            beforeEach(() => {
                                const toastService = fixture.debugElement.injector.get(ToastService);
                                toastServiceSpy = spyOn(toastService, 'activate');
                            });

                            describe('Saving failure', () => {
                                beforeEach(fakeAsync(() => {
                                    updateSpyCount = 0;
                                    updateErrorCode = 1;
                                    Helper.raiseClickEvent(yesButton);
                                    fixture.detectChanges();
                                    tick();
                                }));

                                it('should invoke update method & show error message', () => {
                                    expect(updateSpyCount).toBe(1);
                                    expect(toastServiceSpy.calls.any()).toBeTruthy();
                                    const args = toastServiceSpy.calls.mostRecent().args;
                                    const message = 'Please input Black level limit < Grey level limit <= 0'
                                        + ' <= Orange level limit < Yellow level limit < Red level limit.';
                                    expect(args[0]).toBe(message);
                                    expect(args[1]).toBe(MessageType.Danger);
                                });
                            });

                            describe('Saving success', () => {
                                beforeEach(fakeAsync(() => {
                                    updateSpyCount = 0;
                                    updateErrorCode = 0;
                                    Helper.raiseClickEvent(yesButton);
                                    fixture.detectChanges();
                                    tick();
                                }));

                                it('should invoke update method & show success message in 3 seconds', () => {
                                    expect(updateSpyCount).toBe(1);
                                    expect(toastServiceSpy.calls.any()).toBeTruthy();
                                    const args = toastServiceSpy.calls.mostRecent().args;
                                    const message = 'The Player Win Loss Limit(s) has been updated successfully!';
                                    expect(args[0]).toBe(message);
                                    expect(args[1]).toBe(MessageType.Success);
                                    expect(args[2]).toBe(3);
                                });
                            });
                        });

                        describe('Click Cancel on confirmation', () => {
                            beforeEach(fakeAsync(() => {
                                updateSpyCount = 0;
                                Helper.raiseClickEvent(cancelButton);
                                fixture.detectChanges();
                                tick();
                            }));

                            it('should not invoke update method', () => {
                                expect(updateSpyCount).toBe(0);
                            });
                        });
                    });

                    describe('Accept original value', () => {
                        beforeEach(fakeAsync(() => {
                            input.triggerEventHandler('keydown', {
                                which: 13
                            });
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should display span with text "-2"', () => {
                            expect(span.nativeElement.hidden).toBeFalsy();
                            expect(span.nativeElement.textContent.trim()).toBe('-2');
                        });
                    });

                    describe('Accept empty value', () => {
                        beforeEach(fakeAsync(() => {
                            Helper.raiseInputEvent(input.nativeElement, '');
                            input.triggerEventHandler('keydown', {
                                which: 13
                            });
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should hide span', () => {
                            expect(span.nativeElement.hidden).toBeTruthy();
                        });
                    });

                    describe('Accept invalid value "-1"', () => {
                        beforeEach(fakeAsync(() => {
                            Helper.raiseInputEvent(input.nativeElement, '-1');
                            input.triggerEventHandler('keydown', {
                                which: 13
                            });
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should hide span', () => {
                            expect(span.nativeElement.hidden).toBeTruthy();
                        });
                    });
                });

                describe('Editing grey level', () => {
                    let cells: DebugElement[];
                    let cell: DebugElement;
                    let span: DebugElement;
                    let input: DebugElement;

                    beforeEach(fakeAsync(() => {
                        cells = row.queryAll(By.css('td'));
                        cell = cells[7];
                        span = cell.query(By.css('.nap-link'));
                        input = cell.query(By.css('input'));
                        Helper.raiseClickEvent(span.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    describe('Input new value "0"', () => {
                        beforeEach(fakeAsync(() => {
                            Helper.raiseInputEvent(input.nativeElement, '0');
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should hide span', () => {
                            expect(span.nativeElement.hidden).toBeTruthy();
                        });

                        describe('Blur on input', () => {
                            beforeEach(fakeAsync(() => {
                                input.triggerEventHandler('blur', {});
                                fixture.detectChanges();
                                tick();
                            }));

                            it('should display span with text "-1"', () => {
                                expect(span.nativeElement.hidden).toBeFalsy();
                                expect(span.nativeElement.textContent.trim()).toBe('-1');
                            });
                        });

                        describe('Focus on black level', () => {
                            let blackSpan: DebugElement;
                            let blackInput: DebugElement;

                            beforeEach(fakeAsync(() => {
                                const blackCell = cells[6];
                                input.triggerEventHandler('blur', {});
                                blackSpan = blackCell.query(By.css('.nap-link'));
                                blackInput = blackCell.query(By.css('input'));
                                Helper.raiseClickEvent(blackSpan.nativeElement);
                                fixture.detectChanges();
                                tick();
                            }));

                            it('should display grey span with text "-1"', () => {
                                expect(span.nativeElement.hidden).toBeFalsy();
                                expect(span.nativeElement.textContent.trim()).toBe('-1');
                            });
                        });

                        describe('Accept new value', () => {
                            let yesButton: HTMLElement;
                            let cancelButton: HTMLElement;

                            beforeEach(fakeAsync(() => {
                                input.triggerEventHandler('keydown', {
                                    which: 13
                                });
                                fixture.detectChanges();
                                tick();
                                yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                                cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                                Helper.raiseClickEvent(yesButton);
                                fixture.detectChanges();
                                tick();
                            }));

                            it('should display span with text "0"', () => {
                                expect(span.nativeElement.hidden).toBeFalsy();
                                expect(span.nativeElement.textContent.trim()).toBe('0');
                            });
                        });
                    });
                });

                describe('Editing orange level', () => {
                    let cell: DebugElement;
                    let span: DebugElement;
                    let input: DebugElement;

                    beforeEach(fakeAsync(() => {
                        const cells = row.queryAll(By.css('td'));
                        cell = cells[8];
                        span = cell.query(By.css('.nap-link'));
                        input = cell.query(By.css('input'));
                        Helper.raiseClickEvent(span.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    describe('Accept new value "0" & click Yes on confirmation', () => {
                        let yesButton: HTMLElement;
                        let cancelButton: HTMLElement;

                        beforeEach(fakeAsync(() => {
                            Helper.raiseInputEvent(input.nativeElement, '0');
                            input.triggerEventHandler('keydown', {
                                which: 13
                            });
                            fixture.detectChanges();
                            tick();
                            yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                            cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                            Helper.raiseClickEvent(yesButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should display span with text "0"', () => {
                            expect(span.nativeElement.hidden).toBeFalsy();
                            expect(span.nativeElement.textContent.trim()).toBe('0');
                        });
                    });
                });

                describe('Editing yellow level', () => {
                    let cell: DebugElement;
                    let span: DebugElement;
                    let input: DebugElement;

                    beforeEach(fakeAsync(() => {
                        const cells = row.queryAll(By.css('td'));
                        cell = cells[9];
                        span = cell.query(By.css('.nap-link'));
                        input = cell.query(By.css('input'));
                        Helper.raiseClickEvent(span.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    describe('Accept new value "0" & click Yes on confirmation', () => {
                        let yesButton: HTMLElement;
                        let cancelButton: HTMLElement;

                        beforeEach(fakeAsync(() => {
                            Helper.raiseInputEvent(input.nativeElement, '0');
                            input.triggerEventHandler('keydown', {
                                which: 13
                            });
                            fixture.detectChanges();
                            tick();
                            yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                            cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                            Helper.raiseClickEvent(yesButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should display span with text "0"', () => {
                            expect(span.nativeElement.hidden).toBeFalsy();
                            expect(span.nativeElement.textContent.trim()).toBe('0');
                        });
                    });
                });

                describe('Editing red level', () => {
                    let cell: DebugElement;
                    let span: DebugElement;
                    let input: DebugElement;

                    beforeEach(fakeAsync(() => {
                        const cells = row.queryAll(By.css('td'));
                        cell = cells[10];
                        span = cell.query(By.css('.nap-link'));
                        input = cell.query(By.css('input'));
                        Helper.raiseClickEvent(span.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    describe('Accept new value "0" & click Yes on confirmation', () => {
                        let yesButton: HTMLElement;
                        let cancelButton: HTMLElement;

                        beforeEach(fakeAsync(() => {
                            Helper.raiseInputEvent(input.nativeElement, '0');
                            input.triggerEventHandler('keydown', {
                                which: 13
                            });
                            fixture.detectChanges();
                            tick();
                            yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                            cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                            Helper.raiseClickEvent(yesButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should display span with text "0"', () => {
                            expect(span.nativeElement.hidden).toBeFalsy();
                            expect(span.nativeElement.textContent.trim()).toBe('0');
                        });
                    });
                });
            });

            describe('Deleting first row', () => {
                let confirmationServiceSpy: jasmine.Spy;
                let yesButton: HTMLElement;
                let cancelButton: HTMLElement;

                beforeEach(fakeAsync(() => {
                    const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
                    confirmationServiceSpy = spyOn(confirmationService, 'openContent').and.callThrough();
                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    const row = rows[0];
                    const deleteButton = row.query(By.css('.fa-times'));
                    Helper.raiseClickEvent(deleteButton);
                    fixture.detectChanges();
                    tick();
                    yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                    cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                }));

                // tslint:disable-next-line:max-line-length
                it('should invoke confirmation with message "Are you sure you want to remove setting of this customer for this game?"', () => {
                    expect(confirmationServiceSpy.calls.any()).toBeTruthy();
                    const args = confirmationServiceSpy.calls.mostRecent().args;
                    expect(args[0]).toBe('Are you sure you want to remove setting of this customer for this game?');
                });

                afterEach(() => {
                    Helper.raiseClickEvent(cancelButton);
                    fixture.detectChanges();
                });

                describe('Click Yes on confirmation', () => {
                    let toastServiceSpy: jasmine.Spy;

                    beforeEach(() => {
                        const toastService = fixture.debugElement.injector.get(ToastService);
                        toastServiceSpy = spyOn(toastService, 'activate');
                    });

                    describe('Deleting failure', () => {
                        beforeEach(fakeAsync(() => {
                            deleteSpyCount = 0;
                            deleteErrorCode = 1;
                            Helper.raiseClickEvent(yesButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should invoke delete method & show error message', () => {
                            expect(deleteSpyCount).toBe(1);
                            expect(toastServiceSpy.calls.any()).toBeTruthy();
                            const args = toastServiceSpy.calls.mostRecent().args;
                            const message = 'Can not remove player setting!';
                            expect(args[0]).toBe(message);
                            expect(args[1]).toBe(MessageType.Danger);
                        });
                    });

                    describe('Deleting success', () => {
                        beforeEach(fakeAsync(() => {
                            querySpyCount = 0;
                            deleteSpyCount = 0;
                            deleteErrorCode = 0;
                            Helper.raiseClickEvent(yesButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should invoke update method & query data again', () => {
                            expect(deleteSpyCount).toBe(1);
                            expect(querySpyCount).toBe(1);
                        });
                    });
                });
            });
        });
    });
});
