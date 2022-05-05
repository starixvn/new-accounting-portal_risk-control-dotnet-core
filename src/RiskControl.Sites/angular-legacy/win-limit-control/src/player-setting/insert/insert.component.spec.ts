import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, MessageType } from 'nap-components/toast';
import { ConfirmationService } from 'nap-components/confirmation';
import { CommandResult } from '../../common/model';
import { FilterService } from '../../common/filter';
import { PlayerCurrencySetting } from '../grid';
import { InsertModule, InsertComponent, InsertCommand, InsertHttpService } from './index';
import { expect, Helper } from '../../testing';

class Page {
    searchButton: DebugElement;

    constructor(
        private fixture: ComponentFixture<InsertComponent>
    ) {
        this.searchButton = fixture.debugElement.query(By.css('.btn-primary'));
    }

    get alertElement(): DebugElement {
        return this.fixture.debugElement.query(By.css('.alert-danger'));
    }

    get saveButton(): DebugElement {
        const buttons = this.fixture.debugElement.queryAll(By.css('.btn-primary'));
        return buttons[buttons.length - 1];
    }

    get cancelButton(): DebugElement {
        return this.fixture.debugElement.query(By.css('.btn-danger'));
    }
}

class FakeNgbActiveModal extends NgbActiveModal {
    close(result?: any) { }
    dismiss(reason?: any) { }
}

let validateForInsertingErrorCode = 0;
let insertErrorCode = 0;
let insertSpyCount = 0;
class FakeInsertHttpService extends InsertHttpService {
    validateForInserting(username: string): Observable<CommandResult> {
        const commandResult: CommandResult = {
            ErrorCode: validateForInsertingErrorCode
        };
        return Observable.of(commandResult);
    }

    searchForInserting(username: string): Observable<PlayerCurrencySetting[]> {
        let result: PlayerCurrencySetting[];
        switch (username) {
            case 'user1':
                result = [];
                break;
            case 'user2':
                result = [
                    {
                        Username: 'user2', SiteName: 'Site 1', CurrencyName: 'Currency 1', SettingCount: 2, Products: [
                            {
                                ProductName: 'Product 1', PlayerSettings: [
                                    {
                                        CustId: 2,
                                        Username: 'user2',
                                        CurrencyId: 1,
                                        CurrencyName: 'Currency 1',
                                        SiteId: 1,
                                        SiteName: 'Site 1',
                                        ProductId: 1,
                                        ProductName: 'Product 1',
                                        GroupId: 1,
                                        GroupName: 'Group 1',
                                        BlackLimit: null,
                                        GreyLimit: null,
                                        OrangeLimit: null,
                                        YellowLimit: null,
                                        RedLimit: null,
                                        HasCurrencySetting: true
                                    },
                                    {
                                        CustId: 2,
                                        Username: 'user2',
                                        CurrencyId: 1,
                                        CurrencyName: 'Currency 1',
                                        SiteId: 1,
                                        SiteName: 'Site 1',
                                        ProductId: 1,
                                        ProductName: 'Product 1',
                                        GroupId: 2,
                                        GroupName: 'Group 2',
                                        BlackLimit: null,
                                        GreyLimit: null,
                                        OrangeLimit: null,
                                        YellowLimit: null,
                                        RedLimit: null,
                                        HasCurrencySetting: false
                                    }
                                ]
                            }
                        ]
                    }
                ];
                break;
        }

        return Observable.of(result);
    }

    insert(insertCommands: InsertCommand[]): Observable<CommandResult> {
        insertSpyCount++;
        const commandResult: CommandResult = {
            ErrorCode: insertErrorCode
        };
        return Observable.of(commandResult);
    }
}

class FakeFilterService extends FilterService {
    queryUserName(term: string): Observable<string[]> {
        return Observable.of(['user1', 'user2']);
    }
}

describe('InsertComponent', () => {
    let fixture: ComponentFixture<InsertComponent>;
    let component: InsertComponent;
    let page: Page;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                InsertModule
            ],
            providers: [
                { provide: NgbActiveModal, useClass: FakeNgbActiveModal }
            ]
        }).overrideComponent(InsertComponent, {
            set: {
                providers: [
                    { provide: FilterService, useClass: FakeFilterService },
                    { provide: InsertHttpService, useClass: FakeInsertHttpService }
                ]
            }
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(InsertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        tick();
        page = new Page(fixture);
    }));

    it('should not have alert element', () => {
        expect(page.alertElement).toBeNull();
    });

    function expectAlertMessage(message: string) {
        expect(page.alertElement.nativeElement.textContent.trim()).toBe(message);
    }

    describe('Search with empty username', () => {
        beforeEach(fakeAsync(() => {
            Helper.raiseClickEvent(page.searchButton);
            fixture.detectChanges();
            tick();
        }));

        it('should show alert message "Required field."', () => {
            expectAlertMessage('Required field.');
        });
    });

    describe('Input username "user1"', () => {
        beforeEach(fakeAsync(() => {
            const input = fixture.debugElement.query(By.css('input'));
            Helper.raiseInputEvent(input.nativeElement, 'user1');
            fixture.detectChanges();
            tick();
        }));

        describe('validateForInserting with ErrorCode === 3', () => {
            beforeEach(fakeAsync(() => {
                validateForInsertingErrorCode = 3;
                Helper.raiseClickEvent(page.searchButton);
                fixture.detectChanges();
                tick();
            }));

            it('should display alert message "Invalid username"', () => {
                expectAlertMessage('Invalid username');
            });
        });

        describe('validateForInserting with ErrorCode === 4', () => {
            beforeEach(fakeAsync(() => {
                validateForInsertingErrorCode = 4;
                Helper.raiseClickEvent(page.searchButton);
                fixture.detectChanges();
                tick();
            }));

            // tslint:disable-next-line:max-line-length
            it('should display alert message "There is no product setting for this player. Please check the Currency Win Loss Limit setting."', () => {
                expectAlertMessage('There is no product setting for this player. Please check the Currency Win Loss Limit setting.');
            });
        });

        describe('validateForInserting with ErrorCode === 0', () => {
            beforeEach(fakeAsync(() => {
                validateForInsertingErrorCode = 0;
                Helper.raiseClickEvent(page.searchButton);
                fixture.detectChanges();
                tick();
            }));

            it('should display alert message "There is no more products to set Player Win Loss Limit."', () => {
                expectAlertMessage('There is no more products to set Player Win Loss Limit.');
            });
        });
    });

    describe('Input username "user2"', () => {
        let confirmationService: ConfirmationService;

        beforeEach(fakeAsync(() => {
            confirmationService = fixture.debugElement.injector.get(ConfirmationService);
            const input = fixture.debugElement.query(By.css('input'));
            Helper.raiseInputEvent(input.nativeElement, 'user2');
            fixture.detectChanges();
            tick();
        }));

        describe('Search with valid input', () => {
            let rows: DebugElement[];

            beforeEach(fakeAsync(() => {
                validateForInsertingErrorCode = 0;
                Helper.raiseClickEvent(page.searchButton);
                fixture.detectChanges();
                tick();
                rows = fixture.debugElement.queryAll(By.css('.grid .body tr'));
            }));

            function testRow(row: DebugElement, expectedContents: string[], expectedTextboxValues: string[]) {
                const cells = row.queryAll(By.css('td'));
                const textCells = cells.slice(0, expectedContents.length);
                const contents = textCells.map(cell => cell.nativeElement.textContent.trim());
                expect(contents).toEqual(expectedContents);
                const textboxCells = cells.slice(expectedContents.length);
                const textboxes = textboxCells.map(cell => cell.query(By.css('input')));
                const textboxValues = textboxes.map(textbox => textbox.nativeElement.value);
                expect(textboxValues).toEqual(expectedTextboxValues);
            }

            it('should have 2 data rows', () => {
                expect(rows.length).toBe(2);
                testRow(rows[0], ['user2', 'Site 1', 'Currency 1', 'Product 1', 'Group 1'], ['', '', '', '', '']);
                testRow(rows[1], ['Group 2'], ['', '', '', '', '']);
            });

            describe('Editing row 1', () => {
                let blackInput: DebugElement;
                let greyInput: DebugElement;
                let orangeInput: DebugElement;
                let yellowInput: DebugElement;
                let redInput: DebugElement;

                beforeEach(() => {
                    const row = rows[0];
                    const inputs = row.queryAll(By.css('input'));
                    blackInput = inputs[0];
                    greyInput = inputs[1];
                    orangeInput = inputs[2];
                    yellowInput = inputs[3];
                    redInput = inputs[4];
                });

                describe('no change', () => {
                    beforeEach(fakeAsync(() => {
                        Helper.raiseClickEvent(page.saveButton);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should show alert message "There is no change to insert"', () => {
                        expectAlertMessage('There is no change to insert');
                    });
                });

                describe('Input invalid win limits', () => {
                    let confirmationServiceSpy: jasmine.Spy;

                    beforeEach(fakeAsync(() => {
                        confirmationServiceSpy = spyOn(confirmationService, 'openContent');
                        Helper.raiseInputEvent(orangeInput.nativeElement, '3');
                        Helper.raiseInputEvent(yellowInput.nativeElement, '2');
                        Helper.raiseInputEvent(redInput.nativeElement, '4');
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should not focus on orange input', () => {
                        expect(document.activeElement === orangeInput.nativeElement).toBeFalsy();
                    });

                    describe('Press Save', () => {
                        beforeEach(fakeAsync(() => {
                            Helper.raiseClickEvent(page.saveButton);
                            fixture.detectChanges();
                            tick();
                        }));

                        it('should focus orange input', () => {
                            expect(document.activeElement === orangeInput.nativeElement).toBeTruthy();
                        });

                        it('should not show confirmation', () => {
                            expect(confirmationServiceSpy.calls.any()).toBeFalsy();
                        });
                    });
                });

                describe('Input invalid loss limits & Save', () => {
                    let confirmationServiceSpy: jasmine.Spy;

                    beforeEach(fakeAsync(() => {
                        confirmationServiceSpy = spyOn(confirmationService, 'openContent');
                        Helper.raiseInputEvent(blackInput.nativeElement, '-2');
                        Helper.raiseInputEvent(greyInput.nativeElement, '-3');
                        Helper.raiseClickEvent(page.saveButton);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should not show confirmation', () => {
                        expect(confirmationServiceSpy.calls.any()).toBeFalsy();
                    });
                });

                describe('Input valid limits', () => {
                    let confirmationServiceSpy: jasmine.Spy;
                    let yesButton: HTMLElement;
                    let cancelButton: HTMLElement;

                    beforeEach(fakeAsync(() => {
                        confirmationServiceSpy = spyOn(confirmationService, 'openContent').and.callThrough();
                        Helper.raiseInputEvent(blackInput.nativeElement, '-3');
                        Helper.raiseInputEvent(greyInput.nativeElement, '-2');
                        Helper.raiseInputEvent(orangeInput.nativeElement, '2');
                        Helper.raiseInputEvent(yellowInput.nativeElement, '3');
                        Helper.raiseInputEvent(redInput.nativeElement, '4');
                        Helper.raiseClickEvent(page.saveButton);
                        fixture.detectChanges();
                        tick();

                        yesButton = document.querySelector('.modal-dialog .btn-primary') as HTMLElement;
                        cancelButton = document.querySelector('.modal-dialog .btn-danger') as HTMLElement;
                    }));

                    afterEach(() => {
                        Helper.raiseClickEvent(cancelButton);
                    });

                    it('should show confirmation', () => {
                        expect(confirmationServiceSpy.calls.any()).toBeTruthy();
                        const args = confirmationServiceSpy.calls.mostRecent().args;
                        expect(args[0]).toBe('Are you sure want to set Player Win Loss Limit of user2?');
                    });

                    describe('Click Yes on confirmation', () => {
                        describe('Inserting failure with ErrorCode === 1', () => {
                            beforeEach(fakeAsync(() => {
                                insertSpyCount = 0;
                                insertErrorCode = 1;
                                Helper.raiseClickEvent(yesButton);
                                fixture.detectChanges();
                                tick();
                            }));

                            it('should invoke update method & show error message', () => {
                                expect(insertSpyCount).toBe(1);
                                // tslint:disable-next-line:max-line-length
                                expect(component.error).toBe('Please input Black level limit < Grey level limit <= 0 <= Orange level limit < Yellow level limit < Red level limit.');
                            });
                        });

                        describe('Inserting failure with ErrorCode === 2', () => {
                            beforeEach(fakeAsync(() => {
                                insertSpyCount = 0;
                                insertErrorCode = 2;
                                Helper.raiseClickEvent(yesButton);
                                fixture.detectChanges();
                                tick();
                            }));

                            it('should invoke update method & show error message', () => {
                                expect(insertSpyCount).toBe(1);
                                expect(component.error).toBe('The currency win limit was not set.');
                            });
                        });

                        describe('Inserting success', () => {
                            let toastServiceSpy: jasmine.Spy;
                            let newPlayerSettingSpy: jasmine.Spy;

                            beforeEach(fakeAsync(() => {
                                newPlayerSettingSpy = spyOn(component.newPlayerSetting, 'emit');
                                const toastService = fixture.debugElement.injector.get(ToastService);
                                toastServiceSpy = spyOn(toastService, 'activate');
                                insertSpyCount = 0;
                                insertErrorCode = 0;
                                Helper.raiseClickEvent(yesButton);
                                fixture.detectChanges();
                                tick();
                            }));

                            it('should invoke update method & show success message', () => {
                                expect(insertSpyCount).toBe(1);
                                expect(toastServiceSpy.calls.any()).toBeTruthy();
                                const args = toastServiceSpy.calls.mostRecent().args;
                                const message = 'The Player Win Loss Limit(s) has been added successfully!';
                                expect(args[0]).toBe(message);
                                expect(args[1]).toBe(MessageType.Success);
                            });

                            it('should raise event newPlayerSetting', () => {
                                expect(newPlayerSettingSpy.calls.any()).toBeTruthy();
                                const args = newPlayerSettingSpy.calls.mostRecent().args;
                                expect(args[0]).toBe('new player setting has been inserted');
                            });
                        });
                    });
                });
            });
        });
    });
});
