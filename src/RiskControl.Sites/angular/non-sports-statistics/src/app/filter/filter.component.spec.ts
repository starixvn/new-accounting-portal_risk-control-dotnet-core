// import { DebugElement, Injector, Component } from '@angular/core';
// import { TestBed, ComponentFixture, tick, fakeAsync, async } from '@angular/core/testing';
// import { BrowserModule, By } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';
// import { Helper } from 'nap-components/helper';
// import { RoleId } from '../common';
// import {
//     FilterService, FilterComponent, ExcludeTestPipe, ExcludeTest2Pipe, FilterMode, TimePeriod,
//     ProductTreeviewPipe, GametypeTreeviewPipe, DeviceTreeviewPipe, ReportType, FilterModule
// } from './index';
// import { FakeFilterService } from './filter.service.spec';
// import { expect, eventHelper, createGenericTestComponent } from '../../testing';

// @Component({
//     selector: 'nap-test',
//     template: ''
// })
// class TestComponent {
// }

// const createTestComponent = (html: string) =>
//     createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

// describe('FilterComponent', () => {
//     let fixture: ComponentFixture<FilterComponent>;
//     let component: FilterComponent;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 FilterModule
//             ],
//             providers: [
//                 { provide: FilterService, useClass: FakeFilterService }
//             ]
//         }).compileComponents();
//     }));

//     describe('mode', () => {
//         beforeEach(() => {
//             fixture = TestBed.createComponent(FilterComponent);
//             component = fixture.componentInstance;
//         });

//         describe('normal mode', () => {
//             let modeButton: DebugElement;

//             beforeEach(() => {
//                 fixture.detectChanges();
//                 const buttons = fixture.debugElement.queryAll(By.css('.col-buttons button'));
//                 modeButton = buttons[buttons.length - 1];
//             });

//             it('should be default', () => {
//                 expect(component.isNormalMode).toBe(true);
//             });

//             it('should display button text "HISTORY REPORT"', () => {
//                 expect(modeButton.nativeElement.innerText).toBe('HISTORY REPORT');
//             });

//             it('should switch to history when click button', () => {
//                 modeButton.nativeElement.click();
//                 expect(component.isNormalMode).toBe(false);
//             });
//         });

//         describe('history mode', () => {
//             let modeButton: DebugElement;

//             beforeEach(() => {
//                 component.mode = FilterMode.History;
//                 fixture.detectChanges();
//                 const buttons = fixture.debugElement.queryAll(By.css('.col-buttons button'));
//                 modeButton = buttons[buttons.length - 1];
//             });

//             it('should display button text "BACK"', () => {
//                 expect(modeButton.nativeElement.innerText).toBe('BACK');
//             });
//         });
//     });
// });

// /*describe('FilterComponent', () => {
//     let fixture: ComponentFixture<FilterComponent>;
//     let componentInstance: FilterComponent;
//     let page: Page;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 BrowserModule,
//                 FormsModule,
//                 HttpModule,
//                 TreeviewModule.forRoot()
//             ],
//             declarations: [
//                 DatePickerComponent,
//                 MomentFormatPipe,
//                 DropdownSelectComponent,
//                 DropdownTypeaheadComponent,
//                 DropdownSelectPipe,
//                 SpinnerComponent,
//                 ToastComponent,
//                 GridComponent,
//                 GridModalComponent,
//                 IntegerOnlyDirective,
//                 LegendComponent,
//                 FilterComponent,
//                 ExcludeTestPipe,
//                 ExcludeTest2Pipe,
//                 ProductTreeviewPipe,
//                 GametypeTreeviewPipe,
//                 DeviceTreeviewPipe
//             ],
//             providers: [
//                 COMPILER_PROVIDERS,
//                 HttpService,
//                 ExceptionService,
//                 SpinnerService,
//                 ToastService,
//                 AppService,
//                 FilterService
//             ],
//             schemas: [NO_ERRORS_SCHEMA]
//         });

//         fixture = TestBed.createComponent(FilterComponent);
//         componentInstance = fixture.componentInstance;
//         page = new Page(fixture);
//     });

//     describe('product dropdown', () => {
//         let productDropdownTreeviewWrapper: DropdownTreeviewWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             productDropdownTreeviewWrapper = new DropdownTreeviewWrapper(page.productDropdownTreeview);
//         }));

//         it('require to check at least 1 option', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             productDropdownTreeviewWrapper.uncheckAll();
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Please select at least one product!');
//         }));
//     });

//     describe('date', () => {
//         beforeEach(async(() => {
//             fixture.detectChanges();
//         }));

//         describe('normal mode', () => {
//             let datePickerWrapper: DatePickerWrapper;

//             beforeEach(() => {
//                 datePickerWrapper = new DatePickerWrapper(page.datePicker);
//             });

//             it('load current date default', async(() => {
//                 const today = moment.utc();
//                 const todayString = today.format('MMM DD, YYYY');
//                 expect(datePickerWrapper.getDateString()).toEqual(todayString);
//             }));
//         });

//         describe('history mode', () => {
//             it('require to select date range not to exceed 6 months', async(() => {
//                 componentInstance.startDate = Helper.parseDate('Jan 01, 2013');
//                 componentInstance.endDate = Helper.parseDate('Jul 01, 2013');
//                 page.switchMode();
//                 const toastActivateSpy = page.fakeToastActivate();
//                 const firstCount = toastActivateSpy.calls.count();
//                 page.generateButton.nativeElement.click();
//                 const secondCount = toastActivateSpy.calls.count();
//                 expect(secondCount - firstCount).toBe(1);
//                 expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Date range should not exceed 6 months!');
//             }));
//         });
//     });

//     describe('company dropdown', () => {
//         let companyDropdownTreeviewWrapper: DropdownTreeviewWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             companyDropdownTreeviewWrapper = new DropdownTreeviewWrapper(page.companyDropdownTreeview);
//         }));

//         it('require to check at least 1 option', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             companyDropdownTreeviewWrapper.uncheckAll();
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Please select at least one company!');
//         }));
//     });

//     describe('game-type dropdown', () => {
//         let gameTypeDropdownTreeviewWrapper: DropdownTreeviewWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             gameTypeDropdownTreeviewWrapper = new DropdownTreeviewWrapper(page.gameTypeDropdownTreeview);
//         }));

//         it('require to check at least 1 option', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             gameTypeDropdownTreeviewWrapper.uncheckAll();
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Please select at least one game type!');
//         }));
//     });

//     describe('game-table dropdown', () => {
//         let gameTableDropdownTreeviewWrapper: DropdownTreeviewWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             gameTableDropdownTreeviewWrapper = new DropdownTreeviewWrapper(page.gameTableDropdownTreeview);
//         }));

//         it('require to check at least 1 option', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             gameTableDropdownTreeviewWrapper.uncheckAll();
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Please select at least one game table!');
//         }));

//         it('hide if SLI-Live Casino is not selected', async(() => {
//             let elements = page.dropdownTreeviews;
//             const firstCount = elements.length;
//             const productDropdownTreeview = page.productDropdownTreeview;
//             const elementWrapper = new DropdownTreeviewWrapper(productDropdownTreeview);
//             elementWrapper.uncheckAll();
//             elements = page.dropdownTreeviews;
//             const secondCount = elements.length;
//             expect(firstCount - secondCount).toBe(1);
//         }));
//     });

//     describe('total-bets', () => {
//         let totalBetCompareDropdownSelectWrapper: DropdownSelectWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             totalBetCompareDropdownSelectWrapper = new DropdownSelectWrapper(page.totalBetCompareDropdownSelect);
//         }));

//         it('require to input data for textbox if dropdown is selected', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             totalBetCompareDropdownSelectWrapper.selectItemByIndex(1);
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Total Bets: Value is required!');
//         }));
//     });

//     describe('game-income', () => {
//         let gameIncomeCompareDropdownSelectWrapper: DropdownSelectWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             gameIncomeCompareDropdownSelectWrapper = new DropdownSelectWrapper(page.gameIncomeCompareDropdownSelect);
//         }));

//         it('require to input data for textbox if dropdown is selected', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             gameIncomeCompareDropdownSelectWrapper.selectItemByIndex(1);
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Game Income: Value is required!');
//         }));
//     });

//     describe('house-pt', () => {
//         let housePTCompareDropdownSelectWrapper: DropdownSelectWrapper;
//         let housePTValueDropdownSelectWrapper: DropdownSelectWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             housePTCompareDropdownSelectWrapper = new DropdownSelectWrapper(page.housePtCompareDropdownSelect);
//             housePTValueDropdownSelectWrapper = new DropdownSelectWrapper(page.housePtValueDropdownSelect);
//         }));

//         it('require to select value if dropdown is selected', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             housePTCompareDropdownSelectWrapper.selectItemByIndex(1);
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('House PT %: Value is required!');
//         }));
//     });

//     describe('device dropdown', () => {
//         let deviceDropdownTreeviewWrapper: DropdownTreeviewWrapper;

//         beforeEach(async(() => {
//             fixture.detectChanges();
//             deviceDropdownTreeviewWrapper = new DropdownTreeviewWrapper(page.deviceDropdownTreeview);
//         }));

//         it('require to check at least 1 option', async(() => {
//             const toastActivateSpy = page.fakeToastActivate();
//             deviceDropdownTreeviewWrapper.uncheckAll();
//             const firstCount = toastActivateSpy.calls.count();
//             page.generateButton.nativeElement.click();
//             const secondCount = toastActivateSpy.calls.count();
//             expect(secondCount - firstCount).toBe(1);
//             expect(toastActivateSpy.calls.mostRecent().args[0]).toBe('Please select at least one device!');
//         }));
//     });

//     describe('report dropdown', () => {
//         describe('select report type Monthly when being in Normal mode', () => {
//             beforeEach(async(() => {
//                 componentInstance.mode = FilterMode.Normal;
//                 componentInstance.timePeriod = TimePeriod.Yesterday;
//                 fixture.detectChanges();
//             }));

//             it('switch to History mode & change time period to Last Month', async(() => {
//                 const reportByDropdownSelectWrapper = new DropdownSelectWrapper(page.reportByDropdownSelect);
//                 reportByDropdownSelectWrapper.selectItemByValue(ReportType.Monthly);
//                 fixture.detectChanges();
//                 expect(componentInstance.mode).toBe(FilterMode.History);
//                 expect(componentInstance.timePeriod).toBe(TimePeriod.LastMonth);
//             }));
//         });

//         describe('change default value when switching from history mode to normal mode & current report type is Monthly', () => {
//             beforeEach(async(() => {
//                 componentInstance.mode = FilterMode.History;
//                 componentInstance.selectedReportType = ReportType.Monthly;
//                 fixture.detectChanges();
//             }));

//             it('switch to Product if selected Product is All', async(() => {
//                 page.switchMode();
//                 expect(componentInstance.selectedReportType).toBe(ReportType.Product);
//             }));

//             it('switch to Daily if selected Product is not All', async(() => {
//                 const productDropdownTreeviewWrapper = new DropdownTreeviewWrapper(page.productDropdownTreeview);
//                 productDropdownTreeviewWrapper.uncheckAll();
//                 page.switchMode();
//                 expect(componentInstance.selectedReportType).toBe(ReportType.Daily);
//             }));
//         });
//     });
// });

// class Page {
//     private componentElement: DebugElement;
//     readonly componentInstance: FilterComponent;

//     constructor(
//         private fixture: ComponentFixture<FilterComponent>
//     ) {
//         this.componentInstance = fixture.componentInstance;
//         this.componentElement = fixture.debugElement;
//         const injector = fixture.debugElement.injector;
//         const filterService = injector.get(FilterService);
//         const fakeService = new FakeService();
//         fakeService.fakeFilterService(filterService);
//         const commonService = injector.get(CommonService);
//         fakeService.fakeCommonService(commonService);
//     }

//     fakeToastActivate(): jasmine.Spy {
//         const injector = this.fixture.debugElement.injector;
//         const toastService: ToastService = injector.get(ToastService);
//         return spyOn(toastService, 'activate').and.callThrough();
//     }

//     switchMode() {
//         const buttons = this.buttons;
//         const switchButton = this.buttons[buttons.length - 1];
//         switchButton.nativeElement.click();
//     }

//     get buttons(): DebugElement[] {
//         return this.componentElement.queryAll(By.css('.row > .pull-left > button'));
//     }

//     get isNormalMode(): boolean {
//         const buttons = this.buttons;
//         return buttons.length === 4;
//     }

//     get modeButton(): DebugElement {
//         const buttons = this.buttons;
//         return buttons.length === 4 ? buttons[3] : buttons[1];
//     }

//     get dropdownTreeviews(): DebugElement[] {
//         return this.componentElement.queryAll(By.css('ngx-treeview'));
//     }

//     get productDropdownTreeview(): DebugElement {
//         return this.dropdownTreeviews[0];
//     }

//     get companyDropdownTreeview(): DebugElement {
//         return this.dropdownTreeviews[1];
//     }

//     get gameTypeDropdownTreeview(): DebugElement {
//         return this.dropdownTreeviews[2];
//     }

//     get gameTableDropdownTreeview(): DebugElement {
//         return this.dropdownTreeviews[3];
//     }

//     get deviceDropdownTreeview(): DebugElement {
//         return this.dropdownTreeviews[4];
//     }

//     get generateButton(): DebugElement {
//         return this.buttons[0];
//     }

//     get datePicker(): DebugElement {
//         return this.componentElement.query(By.css('nap-date-picker'));
//     }

//     get startDatePicker(): DebugElement {
//         return this.componentElement.queryAll(By.css('nap-date-picker'))[0];
//     }

//     get endDatePicker(): DebugElement {
//         return this.componentElement.queryAll(By.css('nap-date-picker'))[1];
//     }

//     get usernameDropdownTypeahead(): DebugElement {
//         return this.componentElement.query(By.css('nap-dropdown-typeahead'));
//     }

//     get dropdownSelects(): DebugElement[] {
//         return this.componentElement.queryAll(By.css('nap-dropdown-select'));
//     }

//     get totalBetCompareDropdownSelect(): DebugElement {
//         return this.dropdownSelects[0];
//     }

//     get gameIncomeCompareDropdownSelect(): DebugElement {
//         return this.dropdownSelects[1];
//     }

//     get currencyDropdownSelect(): DebugElement {
//         return this.dropdownSelects[2];
//     }

//     get housePtCompareDropdownSelect(): DebugElement {
//         return this.dropdownSelects[3];
//     }

//     get housePtValueDropdownSelect(): DebugElement {
//         return this.dropdownSelects[4];
//     }

//     get reportByDropdownSelect(): DebugElement {
//         return this.dropdownSelects[5];
//     }
// }

// class DropdownTreeviewWrapper {
//     private allInput: DebugElement;

//     constructor(
//         private debugElement: DebugElement
//     ) {
//         this.allInput = debugElement.query(By.css('.dropdown-item-all > input'));
//     }

//     uncheckAll() {
//         this.allInput.nativeElement.click();
//     }
// }

// class DropdownSelectWrapper {
//     private selectElement: HTMLSelectElement;

//     constructor(
//         private debugElement: DebugElement
//     ) {
//         this.selectElement = debugElement.query(By.css('select')).nativeElement;
//     }

//     selectItemByValue(value: any) {
//         const options = this.selectElement.options;
//         for (let i = 0; i < options.length; i++) {
//             const option = options[i];
//             const optionAttribute = option.attributes['ng-reflect-ng-value'];
//             if (optionAttribute) {
//                 const optionValue = optionAttribute.value;
//                 if (value.toString() === optionValue.toString()) {
//                     this.selectElement.value = optionValue;
//                     this.raiseChange();
//                     break;
//                 }
//             }
//         }
//     }

//     selectItemByIndex(index: number) {
//         const options = this.selectElement.options;
//         const optionAttribute = options[index].attributes['ng-reflect-ng-value'];
//         const optionValue = optionAttribute.value;
//         this.selectElement.value = optionValue;
//         this.raiseChange();
//     }

//     private raiseChange() {
//         const event = new Event('change');
//         this.selectElement.dispatchEvent(event);
//     }
// }

// class DatePickerWrapper {
//     constructor(
//         private datePicker: DebugElement
//     ) { }

//     getDateString(): string {
//         const inputElement = this.datePicker.query(By.css('input')).nativeElement as HTMLInputElement;
//         return inputElement.value;
//     }
// }*/
