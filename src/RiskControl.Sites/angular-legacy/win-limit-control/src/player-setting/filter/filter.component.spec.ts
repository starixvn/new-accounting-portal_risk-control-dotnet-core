import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ToastService } from 'nap-components/toast';
import { QueryCurrencyModel, FilterService } from '../../common/filter';
import { FilterComponent, FilterModule, FilterModel } from './index';
import { expect, Helper, SelectHelper, DropdownTreeviewSelectHelper } from '../../testing';
import {
    fakeProducts, fakeCurrencies, fakeSiteGroups, fakeCreditSiteGroup, fakeDepositSiteGroup
} from '../../common/filter/filter.model.spec';

describe('FilterComponent', () => {
    let fixture: ComponentFixture<FilterComponent>;
    let queryProductsSpy: jasmine.Spy;
    let queryCurrenciesSpy: jasmine.Spy;
    let querySitesSpy: jasmine.Spy;
    let queryUserNameSpy: jasmine.Spy;
    let toastSpy: jasmine.Spy;
    let generateSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FilterModule
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterComponent);
        const component = fixture.componentInstance;
        const filterService = fixture.debugElement.injector.get(FilterService);
        const toastService = fixture.debugElement.injector.get(ToastService);
        queryProductsSpy = spyOn(filterService, 'queryProducts').and.returnValue(Observable.of(fakeProducts));
        queryCurrenciesSpy = spyOn(filterService, 'queryCurrencies').and.returnValue(Observable.of(fakeCurrencies));
        querySitesSpy = spyOn(filterService, 'querySites').and.callFake((productId) => {
            switch (productId) {
                case 0:
                    return Observable.of(fakeSiteGroups);
                case 1:
                    return Observable.of([fakeCreditSiteGroup]);
                case 2:
                    return Observable.of([fakeDepositSiteGroup]);
            }
        });
        queryUserNameSpy = spyOn(filterService, 'queryUserName').and.callFake(() => Observable.of(['aa1', 'aa2']));
        toastSpy = spyOn(toastService, 'activate');
        generateSpy = spyOn(component.generate, 'emit');
    });

    describe('OnInit', () => {
        let userNameInputElement: DebugElement;
        let productSelectHelper: SelectHelper;
        let currencySelectHelper: SelectHelper;
        let siteDropdownTreeviewSelectHelper: DropdownTreeviewSelectHelper;
        let searchButton: DebugElement;

        beforeEach(fakeAsync(() => {
            fixture.detectChanges();
            tick();
            userNameInputElement = fixture.debugElement.query(By.css('nap-dropdown-typeahead input'));
            const productSelectElement = fixture.debugElement.query(By.css('#select-product'));
            productSelectHelper = new SelectHelper(productSelectElement);
            const currencySelectElement = fixture.debugElement.query(By.css('#select-currency'));
            currencySelectHelper = new SelectHelper(currencySelectElement);
            const siteDropdownTreeviewSelectElement = fixture.debugElement.query(By.css('nap-dropdown-treeview-select'));
            siteDropdownTreeviewSelectHelper = new DropdownTreeviewSelectHelper(siteDropdownTreeviewSelectElement);
            searchButton = fixture.debugElement.query(By.css('.btn-primary'));
        }));

        it('should invoke queryProducts and display products with default "All"', () => {
            expect(queryProductsSpy.calls.count()).toBe(1);
            const selectText = productSelectHelper.getTextOfSelectElement();
            expect(selectText).toBe('All');
            const textContents = productSelectHelper.getOptionContents();
            expect(textContents).toEqual(['All', 'Product 1', 'Product 2']);
        });

        it('should invoke queryCurrencies and display currencies with default "All"', () => {
            expect(queryCurrenciesSpy.calls.count()).toBe(1);
            const args = queryCurrenciesSpy.calls.mostRecent().args;
            const expectedQueryCurrencyModel: QueryCurrencyModel = {
                excludeTestCurrency: false,
                isCreditSite: false,
                siteId: 0
            };
            expect(args[0]).toEqual(expectedQueryCurrencyModel);
            const selectText = currencySelectHelper.getTextOfSelectElement();
            expect(selectText).toBe('All');
            const textContents = currencySelectHelper.getOptionContents();
            expect(textContents).toEqual(['All', 'Currency 1', 'Currency 2']);
        });

        it('should invoke querySites and display default "All"', () => {
            expect(querySitesSpy.calls.count()).toBe(1);
            const selectText = siteDropdownTreeviewSelectHelper.getTextOfSelectItem();
            expect(selectText).toBe('All');
            const isHasAllItem = siteDropdownTreeviewSelectHelper.hasAllItem();
            expect(isHasAllItem).toBeTruthy();
            const textContents = siteDropdownTreeviewSelectHelper.getItemContents();
            expect(textContents).toEqual([
                { text: 'Credit Sites', children: [{ text: 'Credit 1' }, { text: 'Credit 2' }] },
                { text: 'Deposit Sites', children: [{ text: 'Deposit 1' }, { text: 'Deposit 2' }] }
            ]);
        });

        describe('Input user name "AB"', () => {
            beforeEach(() => {
                Helper.raiseInputEvent(userNameInputElement.nativeElement, 'AB');
                fixture.detectChanges();
            });

            it('should not invoke queryUserName', () => {
                expect(queryUserNameSpy.calls.any()).toBeFalsy();
            });
        });

        describe('Input user name "ABC"', () => {
            beforeEach(() => {
                Helper.raiseInputEvent(userNameInputElement.nativeElement, 'ABC');
                fixture.detectChanges();
            });

            it('should invoke queryUserName', () => {
                expect(queryUserNameSpy.calls.any()).toBeTruthy();
                const args = queryUserNameSpy.calls.mostRecent().args;
                expect(args[0]).toBe('ABC');
            });
        });

        describe('Select "Product 1"', () => {
            beforeEach(() => {
                querySitesSpy.calls.reset();
                queryCurrenciesSpy.calls.reset();
                productSelectHelper.selectOptionByText('Product 1');
                fixture.detectChanges();
            });

            it('should invoke querySites with right parameters and display sites', () => {
                expect(querySitesSpy.calls.count()).toBe(1);
                const args = querySitesSpy.calls.mostRecent().args;
                expect(args[0]).toBe(1);
                const selectText = siteDropdownTreeviewSelectHelper.getTextOfSelectItem();
                expect(selectText).toBe('All');
                const textContents = siteDropdownTreeviewSelectHelper.getItemContents();
                expect(textContents).toEqual([
                    { text: 'Credit Sites', children: [{ text: 'Credit 1' }, { text: 'Credit 2' }] }
                ]);
            });

            it('should invoke queryCurrencies and display currencies with default "All"', () => {
                expect(queryCurrenciesSpy.calls.count()).toBe(1);
                const args = queryCurrenciesSpy.calls.mostRecent().args;
                const expectedQueryCurrencyModel: QueryCurrencyModel = {
                    excludeTestCurrency: false,
                    isCreditSite: false,
                    siteId: 0
                };
                expect(args[0]).toEqual(expectedQueryCurrencyModel);
                const selectText = currencySelectHelper.getTextOfSelectElement();
                expect(selectText).toBe('All');
                const textContents = currencySelectHelper.getOptionContents();
                expect(textContents).toEqual(['All', 'Currency 1', 'Currency 2']);
            });
        });

        describe('Select "Product 2"', () => {
            beforeEach(() => {
                querySitesSpy.calls.reset();
                queryCurrenciesSpy.calls.reset();
                productSelectHelper.selectOptionByText('Product 2');
                fixture.detectChanges();
            });

            it('should invoke querySites with right parameters and display sites', () => {
                expect(querySitesSpy.calls.count()).toBe(1);
                const args = querySitesSpy.calls.mostRecent().args;
                expect(args[0]).toBe(2);
                const selectText = siteDropdownTreeviewSelectHelper.getTextOfSelectItem();
                expect(selectText).toBe('All');
                const textContents = siteDropdownTreeviewSelectHelper.getItemContents();
                expect(textContents).toEqual([
                    { text: 'Deposit Sites', children: [{ text: 'Deposit 1' }, { text: 'Deposit 2' }] }
                ]);
            });
        });

        describe('Select "Credit 1"', () => {
            beforeEach(() => {
                queryCurrenciesSpy.calls.reset();
                siteDropdownTreeviewSelectHelper.selectItemByText('Credit 1');
                fixture.detectChanges();
            });

            it('should invoke queryCurrencies and display currencies with default "All"', () => {
                expect(queryCurrenciesSpy.calls.count()).toBe(1);
                const args = queryCurrenciesSpy.calls.mostRecent().args;
                const expectedQueryCurrencyModel: QueryCurrencyModel = {
                    isCreditSite: true,
                    siteId: 1
                };
                expect(args[0]).toEqual(expectedQueryCurrencyModel);
                const selectText = currencySelectHelper.getTextOfSelectElement();
                expect(selectText).toBe('All');
                const textContents = currencySelectHelper.getOptionContents();
                expect(textContents).toEqual(['All', 'Currency 1', 'Currency 2']);
            });

            describe('Select "Currency 1" and input username "ABC"', () => {
                beforeEach(fakeAsync(() => {
                    currencySelectHelper.selectOptionByText('Currency 1');
                    Helper.raiseInputEvent(userNameInputElement.nativeElement, 'ABC');
                    fixture.detectChanges();
                    tick();
                }));

                describe('Select "Product 1"', () => {
                    beforeEach(fakeAsync(() => {
                        queryCurrenciesSpy.calls.reset();
                        productSelectHelper.selectOptionByText('Product 1');
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should reset site to value "All"', () => {
                        const textContent = siteDropdownTreeviewSelectHelper.getTextOfSelectItem();
                        expect(textContent).toBe('All');
                    });

                    it('should reset currency to value "All"', () => {
                        const textContent = currencySelectHelper.getTextOfSelectElement();
                        expect(textContent).toBe('All');
                    });
                });

                describe('Search', () => {
                    beforeEach(() => {
                        Helper.raiseClickEvent(searchButton.nativeElement);
                        fixture.detectChanges();
                    });

                    it('should emit generate event with right parameters', () => {
                        expect(generateSpy.calls.count()).toBe(1);
                        const args = generateSpy.calls.mostRecent().args;
                        const expectedFilterModel: FilterModel = {
                            userName: 'ABC',
                            productId: 0,
                            siteId: 1,
                            currencyId: 1
                        };
                        expect(args[0]).toEqual(expectedFilterModel);
                    });
                });
            });
        });

        describe('Select "Deposit 1"', () => {
            beforeEach(() => {
                queryCurrenciesSpy.calls.reset();
                siteDropdownTreeviewSelectHelper.selectItemByText('Deposit 1');
                fixture.detectChanges();
            });

            it('should invoke queryCurrencies and display currencies with default "All"', () => {
                expect(queryCurrenciesSpy.calls.count()).toBe(1);
                const args = queryCurrenciesSpy.calls.mostRecent().args;
                const expectedQueryCurrencyModel: QueryCurrencyModel = {
                    isCreditSite: false,
                    siteId: 3
                };
                expect(args[0]).toEqual(expectedQueryCurrencyModel);
                const selectText = currencySelectHelper.getTextOfSelectElement();
                expect(selectText).toBe('All');
                const textContents = currencySelectHelper.getOptionContents();
                expect(textContents).toEqual(['All', 'Currency 1', 'Currency 2']);
            });
        });

        describe('Search', () => {
            beforeEach(() => {
                Helper.raiseClickEvent(searchButton.nativeElement);
                fixture.detectChanges();
            });

            it('should emit generate event with right parameters', () => {
                expect(generateSpy.calls.count()).toBe(1);
                const args = generateSpy.calls.mostRecent().args;
                const expectedFilterModel: FilterModel = {
                    userName: undefined,
                    productId: 0,
                    siteId: undefined,
                    currencyId: 0
                };
                expect(args[0]).toEqual(expectedFilterModel);
            });
        });
    });
});
