import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpOptions, DefaultHttpOptions } from 'nap-components/http';
import { ConfirmationService } from 'nap-components/confirmation';
import { ToastService, MessageType } from 'nap-components/toast';
import { AuthorizationService } from '../../common/authorization';
import { GroupSettingService } from '../../common/group-setting';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { GridModule, GridComponent, GridService, ProductSetting, ProductSettingGroup } from './index';
import { expect, Helper } from '../../testing';

const fakeFilterModel: FilterModel = {
    productId: 1,
    productName: 'Product 1',
    currencyId: 1,
    siteId: 1,
    isCreditSite: true,
    excludeTestCurrency: false
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

function createProductSetting(seed: number, checked: boolean): ProductSetting {
    return {
        CurrencyName: 'Currency ' + seed,
        SiteName: 'Site ' + seed,
        ProductName: 'Product ' + seed,
        Groups: [
            createProductSettingGroup(seed, checked)
        ]
    };
}

function createProductSettingGroup(seed: number, checked: boolean): ProductSettingGroup {
    return {
        ProductId: seed,
        CurrencyId: seed,
        SiteId: seed,
        IsCreditSite: checked,
        GroupId: seed,
        GroupName: 'Group ' + seed,
        BlackLimit: -seed - 2,
        GreyLimit: -seed - 1,
        OrangeLimit: seed + 1,
        YellowLimit: seed + 2,
        RedLimit: seed + 3,
        IsBlockedPlacebetRedLevel: checked,
        IsBlockedTransferRedLevel: checked
    };
}

let updateSpyCount = 0;
let updateErrorCode = 0;
let fakeQueryFilterModel: FilterModel;
let fakeQueryHttpOptions: HttpOptions;
class GridServiceStub extends GridService {
    query(filterModel: FilterModel, httpOptions = DefaultHttpOptions): Observable<ProductSetting[]> {
        fakeQueryFilterModel = filterModel;
        fakeQueryHttpOptions = httpOptions;
        let productSettings: ProductSetting[] = [];
        switch (filterModel.productId) {
            case 1:
                productSettings = [];
                break;
            case 2:
                productSettings = [
                    {
                        CurrencyName: 'Currency 1', SiteName: 'Site 1', ProductName: 'Product 1', Groups: [
                            {
                                ProductId: 1,
                                CurrencyId: 1,
                                SiteId: 1,
                                IsCreditSite: true,
                                GroupId: 1,
                                GroupName: 'Group 1',
                                BlackLimit: -2,
                                GreyLimit: -1,
                                OrangeLimit: 1,
                                YellowLimit: 2,
                                RedLimit: 3,
                                IsBlockedPlacebetRedLevel: false,
                                IsBlockedTransferRedLevel: false
                            },
                            {
                                ProductId: 1,
                                CurrencyId: 1,
                                SiteId: 1,
                                IsCreditSite: true,
                                GroupId: 2,
                                GroupName: 'Group 2',
                                BlackLimit: -1234,
                                GreyLimit: -123,
                                OrangeLimit: 123,
                                YellowLimit: 1234,
                                RedLimit: 12345,
                                IsBlockedPlacebetRedLevel: true,
                                IsBlockedTransferRedLevel: false
                            }
                        ]
                    },
                    {
                        CurrencyName: 'Currency 2', SiteName: 'Site 2', ProductName: 'Product 2', Groups: [
                            {
                                ProductId: 2,
                                CurrencyId: 2,
                                SiteId: 2,
                                IsCreditSite: false,
                                GroupId: 3,
                                GroupName: 'Group 3',
                                BlackLimit: -1234567,
                                GreyLimit: 0,
                                OrangeLimit: 1,
                                YellowLimit: 0,
                                RedLimit: 123456789,
                                IsBlockedPlacebetRedLevel: true,
                                IsBlockedTransferRedLevel: true
                            }
                        ]
                    }
                ];
                break;
            case 3:
                for (let i = 0; i < 20; i++) {
                    productSettings.push(createProductSetting(1, false));
                }
                for (let i = 0; i < 2; i++) {
                    productSettings.push(createProductSetting(2, true));
                }
                break;
        }

        return Observable.of(productSettings);
    }

    update(settings: ProductSettingGroup[]): Observable<CommandResult> {
        updateSpyCount++;
        const commandResult: CommandResult = {
            errorCode: updateErrorCode
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

class Page {
    headerRow: DebugElement;

    constructor(
        private fixture: ComponentFixture<TestComponent>
    ) {
        this.headerRow = this.fixture.debugElement.queryAll(By.css('.grid .header tr'))[2];
    }

    queryHeaderTextboxes(): DebugElement[] {
        const inputs = this.headerRow.queryAll(By.css('input'));
        return inputs.slice(0, 5);
    }

    queryHeaderButtons(): DebugElement[] {
        return this.headerRow.queryAll(By.css('button'));
    }

    queryHeaderCheckboxes(): DebugElement[] {
        const inputs = this.headerRow.queryAll(By.css('input'));
        return inputs.slice(5);
    }

    querySaveButton(): DebugElement {
        return this.fixture.debugElement.query(By.css('.btn-primary'));
    }

    queryCancelButton(): DebugElement {
        return this.fixture.debugElement.query(By.css('.btn-danger'));
    }

    applyLimit(index: number, text: string) {
        const textboxes = this.queryHeaderTextboxes();
        const limitTextbox = textboxes[index];
        Helper.raiseInputEvent(limitTextbox.nativeElement, text);
        this.fixture.detectChanges();
        tick();
        const buttons = this.queryHeaderButtons();
        const limitButton = buttons[index];
        Helper.raiseClickEvent(limitButton);
        this.fixture.detectChanges();
        tick();
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
        function testRow(row: DebugElement, expectedContents: string[],
            expectedTextboxValues: string[], expectedCheckboxValues: boolean[]) {
            const cells = row.queryAll(By.css('td'));
            const textCells = cells.slice(0, expectedContents.length);
            const contents = textCells.map(cell => cell.nativeElement.textContent.trim());
            expect(contents).toEqual(expectedContents);
            const textboxCells = cells.slice(expectedContents.length, expectedContents.length + 5);
            const textboxes = textboxCells.map(cell => cell.query(By.css('input')));
            const textboxValues = textboxes.map(textbox => textbox.nativeElement.value);
            expect(textboxValues).toEqual(expectedTextboxValues);
            const checkboxCells = cells.slice(expectedContents.length + 5);
            const checkboxes = checkboxCells.map(cell => cell.query(By.css('input')));
            const checkboxValues = checkboxes.map(checkbox => checkbox.nativeElement.checked);
            expect(checkboxValues).toEqual(expectedCheckboxValues);
        }

        describe('Product 1 without data', () => {
            beforeEach(fakeAsync(() => {
                fakeFilterModel.productId = 1;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                tick();
                page = new Page(fixture);
            }));

            it('should have grid', () => {
                const gridElement = fixture.debugElement.query(By.css('.grid'));
                expect(gridElement).not.toBeNull();
            });

            it('should display breadcrumb "Product 1 - Currency Win Loss Limit Setting"', () => {
                const breadcrumbItemElement = fixture.debugElement.query(By.css('.breadcrumb-container .breadcrumb-item'));
                expect(breadcrumbItemElement.nativeElement.textContent.trim()).toBe('Product 1 - Currency Win Loss Limit Setting');
            });

            it('should display "There is no data"', () => {
                const bodyTable = fixture.debugElement.query(By.css('.grid .body'));
                expect(bodyTable.nativeElement.textContent.trim()).toBe('There is no data');
            });

            it('should invoke query with right parameters', () => {
                expect(fakeQueryFilterModel).toBe(fakeFilterModel);
                expect(fakeQueryHttpOptions).toBe(DefaultHttpOptions);
            });
        });

        describe('Product 2 with data', () => {
            beforeEach(fakeAsync(() => {
                fakeFilterModel.productId = 2;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                tick();
                page = new Page(fixture);
            }));

            it('should invoke query with right parameters', () => {
                expect(fakeQueryFilterModel).toBe(fakeFilterModel);
                expect(fakeQueryHttpOptions).toBe(DefaultHttpOptions);
            });

            function expectToDisplayOriginalBodyData() {
                const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-2', '-1', '1', '2', '3'], [false, false]);
                testRow(rows[1], ['Group 2'], ['-1,234', '-123', '123', '1,234', '12,345'], [true, false]);
                testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-1,234,567', '0', '1', '0', '123,456,789'], [true, true]);
            }

            it('should display data', () => {
                expectToDisplayOriginalBodyData();
            });

            it('should display default value on header', () => {
                const textboxes = page.queryHeaderTextboxes();
                const textboxValues = textboxes.map(input => input.nativeElement.value);
                expect(textboxValues).toEqual(['', '', '', '', '']);
                const checkboxes = page.queryHeaderCheckboxes();
                const checkboxValues = checkboxes.map(checkbox => checkbox.nativeElement.checked);
                expect(checkboxValues).toEqual([false, false]);
            });

            describe('Save with invalid loss limit change', () => {
                let confirmationServiceSpy: jasmine.Spy;
                let invalidInput: DebugElement;

                beforeEach(fakeAsync(() => {
                    const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
                    confirmationServiceSpy = spyOn(confirmationService, 'openContent');

                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    const row = rows[0];
                    invalidInput = row.query(By.css('input'));
                    Helper.raiseInputEvent(invalidInput.nativeElement, '-1');

                    const saveButton = page.querySaveButton();
                    Helper.raiseClickEvent(saveButton);
                    fixture.detectChanges();
                    tick();
                }));

                it('should not invoke confirmation', () => {
                    expect(confirmationServiceSpy.calls.any()).toBeFalsy();
                });

                it('should focus in the first invalid input', () => {
                    expect(document.activeElement).toBe(invalidInput.nativeElement);
                });
            });

            describe('Save with invalid win limit change', () => {
                let confirmationServiceSpy: jasmine.Spy;
                let invalidInput: DebugElement;

                beforeEach(fakeAsync(() => {
                    const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
                    confirmationServiceSpy = spyOn(confirmationService, 'openContent');

                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    const row = rows[0];
                    const inputs = row.queryAll(By.css('input'));
                    invalidInput = inputs[2];
                    Helper.raiseInputEvent(invalidInput.nativeElement, '2');

                    const saveButton = page.querySaveButton();
                    Helper.raiseClickEvent(saveButton);
                    fixture.detectChanges();
                    tick();
                }));

                it('should not invoke confirmation', () => {
                    expect(confirmationServiceSpy.calls.any()).toBeFalsy();
                });

                it('should focus in the first invalid input', () => {
                    expect(document.activeElement).toBe(invalidInput.nativeElement);
                });
            });

            describe('Save with no change', () => {
                let toastServiceSpy: jasmine.Spy;

                beforeEach(fakeAsync(() => {
                    const toastService = fixture.debugElement.injector.get(ToastService);
                    toastServiceSpy = spyOn(toastService, 'activate');

                    const saveButton = page.querySaveButton();
                    Helper.raiseClickEvent(saveButton);
                    fixture.detectChanges();
                    tick();
                }));

                it('should activate toast with message "There is no change to save"', () => {
                    expect(toastServiceSpy.calls.any()).toBeTruthy();
                    const args = toastServiceSpy.calls.mostRecent().args;
                    expect(args[0]).toBe('There is no change to save');
                    expect(args[1]).toBe(MessageType.Warning);
                });
            });

            describe('Save with valid change', () => {
                let confirmationServiceSpy: jasmine.Spy;
                let validInput: DebugElement;
                let yesButton: HTMLElement;
                let cancelButton: HTMLElement;

                beforeEach(fakeAsync(() => {
                    const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
                    confirmationServiceSpy = spyOn(confirmationService, 'openContent').and.callThrough();

                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    const row = rows[0];
                    validInput = row.query(By.css('input'));
                    Helper.raiseInputEvent(validInput.nativeElement, '0');

                    const saveButton = page.querySaveButton();
                    Helper.raiseClickEvent(saveButton);
                    fixture.detectChanges();
                    tick();

                    yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                    cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                }));

                it('should invoke confirmation with message "Are you sure want to change this setting?"', () => {
                    expect(confirmationServiceSpy.calls.any()).toBeTruthy();
                    const args = confirmationServiceSpy.calls.mostRecent().args;
                    expect(args[0]).toBe('Are you sure want to change this setting?');
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
                            const message = 'The setting has been updated successfully!';
                            expect(args[0]).toBe(message);
                            expect(args[1]).toBe(MessageType.Success);
                            expect(args[2]).toBe(3);
                        });

                        it('should fetch data after saving', () => {
                            expect(fakeQueryHttpOptions).toEqual({ noToast: true });
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

            describe('Apply Black limit', () => {
                describe('Apply empty value', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(0, '');
                    }));

                    it('should display original black limit in body cells', () => {
                        expectToDisplayOriginalBodyData();
                    });
                });

                describe('Apply value "-123"', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(0, '-123');
                    }));

                    it('should display black limit "-123" in body cells', () => {
                        const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                        testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-123', '-1', '1', '2', '3'], [false, false]);
                        testRow(rows[1], ['Group 2'], ['-123', '-123', '123', '1,234', '12,345'], [true, false]);
                        testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-123', '0', '1', '0', '123,456,789'], [true, true]);
                    });

                    describe('Click button Cancel', () => {
                        beforeEach(fakeAsync(() => {
                            const cancelButton = page.queryCancelButton();
                            Helper.raiseClickEvent(cancelButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should reset to default values', () => {
                            const textboxes = page.queryHeaderTextboxes();
                            expect(textboxes[0].nativeElement.value).toBe('');
                            expectToDisplayOriginalBodyData();
                        });
                    });
                });
            });

            describe('Apply Grey limit', () => {
                describe('Apply empty value', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(1, '');
                    }));

                    it('should display original grey limit in body cells', () => {
                        expectToDisplayOriginalBodyData();
                    });
                });

                describe('Apply value "-12"', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(1, '-12');
                    }));

                    it('should display grey limit "-12" in body cells', () => {
                        const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                        testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-2', '-12', '1', '2', '3'], [false, false]);
                        testRow(rows[1], ['Group 2'], ['-1,234', '-12', '123', '1,234', '12,345'], [true, false]);
                        // tslint:disable-next-line:max-line-length
                        testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-1,234,567', '-12', '1', '0', '123,456,789'], [true, true]);
                    });

                    describe('Click button Cancel', () => {
                        beforeEach(fakeAsync(() => {
                            const cancelButton = page.queryCancelButton();
                            Helper.raiseClickEvent(cancelButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should reset to default values', () => {
                            const textboxes = page.queryHeaderTextboxes();
                            expect(textboxes[1].nativeElement.value).toBe('');
                            expectToDisplayOriginalBodyData();
                        });
                    });
                });
            });

            describe('Apply Orange limit', () => {
                describe('Apply empty value', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(2, '');
                    }));

                    it('should display original orange limit in body cells', () => {
                        expectToDisplayOriginalBodyData();
                    });
                });

                describe('Apply value "12"', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(2, '12');
                    }));

                    it('should display orange limit "12" in body cells', () => {
                        const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                        testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-2', '-1', '12', '2', '3'], [false, false]);
                        testRow(rows[1], ['Group 2'], ['-1,234', '-123', '12', '1,234', '12,345'], [true, false]);
                        // tslint:disable-next-line:max-line-length
                        testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-1,234,567', '0', '12', '0', '123,456,789'], [true, true]);
                    });

                    describe('Click button Cancel', () => {
                        beforeEach(fakeAsync(() => {
                            const cancelButton = page.queryCancelButton();
                            Helper.raiseClickEvent(cancelButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should reset to default values', () => {
                            const textboxes = page.queryHeaderTextboxes();
                            expect(textboxes[2].nativeElement.value).toBe('');
                            expectToDisplayOriginalBodyData();
                        });
                    });
                });
            });

            describe('Apply Yellow limit', () => {
                describe('Apply empty value', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(3, '');
                    }));

                    it('should display original yellow limit in body cells', () => {
                        expectToDisplayOriginalBodyData();
                    });
                });

                describe('Apply value "123"', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(3, '123');
                    }));

                    it('should display yellow limit "123" in body cells', () => {
                        const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                        testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-2', '-1', '1', '123', '3'], [false, false]);
                        testRow(rows[1], ['Group 2'], ['-1,234', '-123', '123', '123', '12,345'], [true, false]);
                        // tslint:disable-next-line:max-line-length
                        testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-1,234,567', '0', '1', '123', '123,456,789'], [true, true]);
                    });

                    describe('Click button Cancel', () => {
                        beforeEach(fakeAsync(() => {
                            const cancelButton = page.queryCancelButton();
                            Helper.raiseClickEvent(cancelButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should reset to default values', () => {
                            const textboxes = page.queryHeaderTextboxes();
                            expect(textboxes[3].nativeElement.value).toBe('');
                            expectToDisplayOriginalBodyData();
                        });
                    });
                });
            });

            describe('Apply Red limit', () => {
                describe('Apply empty value', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(4, '');
                    }));

                    it('should display original red limit in body cells', () => {
                        expectToDisplayOriginalBodyData();
                    });
                });

                describe('Apply value "1234"', () => {
                    beforeEach(fakeAsync(() => {
                        page.applyLimit(4, '1234');
                    }));

                    it('should display red limit "1234" in body cells', () => {
                        const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                        testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-2', '-1', '1', '2', '1,234'], [false, false]);
                        testRow(rows[1], ['Group 2'], ['-1,234', '-123', '123', '1,234', '1,234'], [true, false]);
                        testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-1,234,567', '0', '1', '0', '1,234'], [true, true]);
                    });

                    describe('Click button Cancel', () => {
                        beforeEach(fakeAsync(() => {
                            const cancelButton = page.queryCancelButton();
                            Helper.raiseClickEvent(cancelButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should reset to default values', () => {
                            const textboxes = page.queryHeaderTextboxes();
                            expect(textboxes[4].nativeElement.value).toBe('');
                            expectToDisplayOriginalBodyData();
                        });
                    });
                });
            });

            describe('checkbox "Allow Block Place Bet"', () => {
                let headerCheckbox: DebugElement;
                let bodyCheckboxes: DebugElement[];

                beforeEach(() => {
                    const checkboxes = page.queryHeaderCheckboxes();
                    headerCheckbox = checkboxes[0];
                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    bodyCheckboxes = rows.map(row => row.queryAll(By.css('input'))[5]);
                });

                it('should display checkbox on header with unchecked status', () => {
                    expect(headerCheckbox.nativeElement.checked).toBeFalsy();
                });

                describe('Click on checkbox on body row 1', () => {
                    beforeEach(fakeAsync(() => {
                        Helper.raiseClickEvent(bodyCheckboxes[0].nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should display checkbox on header with checked status', () => {
                        expect(headerCheckbox.nativeElement.checked).toBeTruthy();
                    });

                    describe('Click on checkbox on header', () => {
                        beforeEach(fakeAsync(() => {
                            Helper.raiseClickEvent(headerCheckbox.nativeElement);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should set red checkbox in body to unchecked', () => {
                            const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                            testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-2', '-1', '1', '2', '3'], [false, false]);
                            testRow(rows[1], ['Group 2'], ['-1,234', '-123', '123', '1,234', '12,345'], [false, false]);
                            // tslint:disable-next-line:max-line-length
                            testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-1,234,567', '0', '1', '0', '123,456,789'], [false, true]);
                        });
                    });
                });

                describe('Click on checkbox on header', () => {
                    beforeEach(fakeAsync(() => {
                        Helper.raiseClickEvent(headerCheckbox.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should set red checkbox in body to checked', () => {
                        const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                        testRow(rows[0], ['1', 'Currency 1', 'Site 1', 'Group 1'], ['-2', '-1', '1', '2', '3'], [true, false]);
                        testRow(rows[1], ['Group 2'], ['-1,234', '-123', '123', '1,234', '12,345'], [true, false]);
                        // tslint:disable-next-line:max-line-length
                        testRow(rows[2], ['2', 'Currency 2', 'Site 2', 'Group 3'], ['-1,234,567', '0', '1', '0', '123,456,789'], [true, true]);
                    });

                    describe('Click on checkbox on body row 2', () => {
                        beforeEach(fakeAsync(() => {
                            Helper.raiseClickEvent(bodyCheckboxes[1].nativeElement);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should display checkbox on header with unchecked status', () => {
                            expect(headerCheckbox.nativeElement.checked).toBeFalsy();
                        });
                    });
                });
            });

            describe('checkbox "Allow Block Transfer/Withdraw"', () => {
                let headerCheckbox: DebugElement;
                let bodyCheckboxes: DebugElement[];

                beforeEach(() => {
                    const checkboxes = page.queryHeaderCheckboxes();
                    headerCheckbox = checkboxes[1];
                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    bodyCheckboxes = rows.map(row => row.queryAll(By.css('input'))[6]);
                });

                it('should display checkbox with unchecked status', () => {
                    expect(headerCheckbox.nativeElement.checked).toBeFalsy();
                });

                it('should display checkboxes on body with right disabled status', () => {
                    expect(bodyCheckboxes[0].nativeElement.disabled).toBeTruthy();
                    expect(bodyCheckboxes[1].nativeElement.disabled).toBeTruthy();
                    expect(bodyCheckboxes[2].nativeElement.disabled).toBeFalsy();
                });

                describe('Click on checkbox on body row 2', () => {
                    beforeEach(fakeAsync(() => {
                        Helper.raiseClickEvent(bodyCheckboxes[1].nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should display checkbox on header with unchecked status', () => {
                        expect(headerCheckbox.nativeElement.checked).toBeFalsy();
                    });

                    describe('Click on checkbox on header', () => {
                        beforeEach(fakeAsync(() => {
                            Helper.raiseClickEvent(headerCheckbox.nativeElement);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should display checkbox on row 3 with checked status', () => {
                            expect(bodyCheckboxes[2].nativeElement.checked).toBeTruthy();
                        });
                    });
                });
            });
        });

        describe('Product 3', () => {
            let pagingSlectElement: DebugElement;

            beforeEach(fakeAsync(() => {
                fakeFilterModel.productId = 3;
                const template = '<nap-grid [filterModel]="filterModel"></nap-grid>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                tick();
                page = new Page(fixture);
                pagingSlectElement = fixture.debugElement.query(By.css('nap-pagination select'));
            }));

            it('should display page size options "20, 50, 100, 200"', () => {
                const options = pagingSlectElement.queryAll(By.css('option'));
                const optionContents = options.map(option => option.nativeElement.textContent.trim());
                expect(optionContents).toEqual(['20', '50', '100', '200']);
            });

            it('should display default page size "20"', () => {
                expect(pagingSlectElement.nativeElement.value).toBe('20');
            });

            it('should display first 20 data rows', () => {
                const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                expect(rows.length).toBe(20);
                rows.forEach((row, index) => {
                    testRow(row, [(index + 1).toString(), 'Currency 1', 'Site 1', 'Group 1'], ['-3', '-2', '2', '3', '4'], [false, false]);
                });
            });

            it('should display checkboxes on header with unchecked state', () => {
                const checkboxes = page.queryHeaderCheckboxes();
                const values = checkboxes.map(checkbox => checkbox.nativeElement.checked);
                expect(values).toEqual([false, false]);
            });

            describe('switch to page 2', () => {
                beforeEach(fakeAsync(() => {
                    const pageLinks = fixture.debugElement.queryAll(By.css('nap-pagination .page-link'));
                    const nextPageLink = pageLinks[pageLinks.length - 1];
                    Helper.raiseClickEvent(nextPageLink);
                    fixture.detectChanges();
                    tick();
                }));

                it('should display next 2 data rows', () => {
                    const rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
                    expect(rows.length).toBe(2);
                    rows.forEach((row, index) => {
                        // tslint:disable-next-line:max-line-length
                        testRow(row, [(index + 21).toString(), 'Currency 2', 'Site 2', 'Group 2'], ['-4', '-3', '3', '4', '5'], [true, true]);
                    });
                });

                it('should display checkboxes on header with checked state', () => {
                    const checkboxes = page.queryHeaderCheckboxes();
                    const values = checkboxes.map(checkbox => checkbox.nativeElement.checked);
                    expect(values).toEqual([true, true]);
                });
            });
        });
    });
});
