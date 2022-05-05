import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ToastService } from 'nap-components/toast';
import { QueryCurrencyModel, FilterService } from '../../common/filter';
import { FilterComponent, FilterModule, FilterModel } from './index';
import { expect, Helper, SelectHelper } from '../../testing';
import { fakeProducts, fakeCurrencies, fakeSiteGroups, fakeDepositSiteGroup } from '../../common/filter/filter.model.spec';

describe('FilterComponent', () => {
    let fixture: ComponentFixture<FilterComponent>;
    let queryProductsSpy: jasmine.Spy;
    let queryCurrenciesSpy: jasmine.Spy;
    let querySitesSpy: jasmine.Spy;
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
                case 1:
                    return Observable.of(fakeSiteGroups);
                case 2:
                    return Observable.of([fakeDepositSiteGroup]);
            }
        });
        toastSpy = spyOn(toastService, 'activate');
        generateSpy = spyOn(component.generate, 'emit');
    });

    describe('OnInit', () => {
        let searchButton: DebugElement;
        let productSelectHelper: SelectHelper;
        let currencySelectHelper: SelectHelper;
        let siteSelectHelper: SelectHelper;

        beforeEach(fakeAsync(() => {
            fixture.detectChanges();
            tick();
            const productSelectElement = fixture.debugElement.query(By.css('#select-product'));
            productSelectHelper = new SelectHelper(productSelectElement);
            const currencySelectElement = fixture.debugElement.query(By.css('#select-currency'));
            currencySelectHelper = new SelectHelper(currencySelectElement);
            const siteSelectElement = fixture.debugElement.query(By.css('#select-site'));
            siteSelectHelper = new SelectHelper(siteSelectElement);
            searchButton = fixture.debugElement.query(By.css('button'));
        }));

        it('should invoke queryProducts and display products without default select', () => {
            expect(queryProductsSpy.calls.count()).toBe(1);
            const selectText = productSelectHelper.getTextOfSelectElement();
            expect(selectText).toBe('');
            const textContents = productSelectHelper.getOptionContents();
            expect(textContents).toEqual(['Product 1', 'Product 2']);
        });

        it('should invoke queryCurrencies and display currencies with default "All"', () => {
            expect(queryCurrenciesSpy.calls.count()).toBe(1);
            const args = queryCurrenciesSpy.calls.mostRecent().args;
            const expectedQueryCurrencyModel: QueryCurrencyModel = {
                excludeTestCurrency: true,
                isCreditSite: false,
                siteId: 0
            };
            expect(args[0]).toEqual(expectedQueryCurrencyModel);
            const selectText = currencySelectHelper.getTextOfSelectElement();
            expect(selectText).toBe('All');
            const textContents = currencySelectHelper.getOptionContents();
            expect(textContents).toEqual(['All', 'Currency 1', 'Currency 2']);
        });

        it('should not invoke querySites and display default "All"', () => {
            expect(querySitesSpy.calls.count()).toBe(0);
            const selectText = siteSelectHelper.getTextOfSelectElement();
            expect(selectText).toBe('All');
            const textContents = siteSelectHelper.getOptionContents();
            expect(textContents).toEqual(['All']);
        });

        describe('Search', () => {
            beforeEach(fakeAsync(() => {
                Helper.raiseClickEvent(searchButton.nativeElement);
                fixture.detectChanges();
                tick();
            }));

            it('should active toast message "Please select a product"', () => {
                expect(toastSpy.calls.count()).toBe(1);
                const args = toastSpy.calls.mostRecent().args;
                expect(args[0]).toBe('Please select a product');
                expect(generateSpy.calls.any()).toBeFalsy();
            });
        });

        describe('Select "Currency 1"', () => {
            beforeEach(fakeAsync(() => {
                currencySelectHelper.selectOptionByText('Currency 1');
                fixture.detectChanges();
                tick();
            }));

            it('should display "Currency 1"', () => {
                const textContent = currencySelectHelper.getTextOfSelectElement();
                expect(textContent).toBe('Currency 1');
            });

            describe('Select "Product 1"', () => {
                beforeEach(fakeAsync(() => {
                    queryCurrenciesSpy.calls.reset();
                    productSelectHelper.selectOptionByText('Product 1');
                    fixture.detectChanges();
                    tick();
                }));

                it('should display currency "All"', () => {
                    const textContent = currencySelectHelper.getTextOfSelectElement();
                    expect(textContent).toBe('All');
                });
            });
        });

        describe('Select "Product 1"', () => {
            beforeEach(fakeAsync(() => {
                queryCurrenciesSpy.calls.reset();
                productSelectHelper.selectOptionByText('Product 1');
                fixture.detectChanges();
                tick();
            }));

            it('should invoke querySites with right parameters and display sites', () => {
                expect(querySitesSpy.calls.count()).toBe(1);
                const args = querySitesSpy.calls.mostRecent().args;
                expect(args[0]).toBe(1);
                const selectText = siteSelectHelper.getTextOfSelectElement();
                expect(selectText).toBe('All');
                const textContents = siteSelectHelper.getOptionContents();
                expect(textContents).toEqual(['All', 'Credit 1', 'Credit 2', 'Deposit 1', 'Deposit 2']);
            });

            it('should invoke queryCurrencies and display currencies with default "All"', () => {
                expect(queryCurrenciesSpy.calls.count()).toBe(1);
                const args = queryCurrenciesSpy.calls.mostRecent().args;
                const expectedQueryCurrencyModel: QueryCurrencyModel = {
                    excludeTestCurrency: true,
                    isCreditSite: false,
                    siteId: 0
                };
                expect(args[0]).toEqual(expectedQueryCurrencyModel);
                const selectText = currencySelectHelper.getTextOfSelectElement();
                expect(selectText).toBe('All');
                const textContents = currencySelectHelper.getOptionContents();
                expect(textContents).toEqual(['All', 'Currency 1', 'Currency 2']);
            });

            describe('Search', () => {
                beforeEach(fakeAsync(() => {
                    Helper.raiseClickEvent(searchButton.nativeElement);
                    fixture.detectChanges();
                    tick();
                }));

                it('should emit generate event with right parameters', () => {
                    expect(generateSpy.calls.count()).toBe(1);
                    const args = generateSpy.calls.mostRecent().args;
                    const expectedFilterModel: FilterModel = {
                        productId: 1,
                        productName: 'Product 1',
                        siteId: 0,
                        isCreditSite: false,
                        currencyId: 0,
                        excludeTestCurrency: false
                    };
                    expect(args[0]).toEqual(expectedFilterModel);
                });
            });

            describe('Select "Currency 1"', () => {
                beforeEach(fakeAsync(() => {
                    currencySelectHelper.selectOptionByText('Currency 1');
                    fixture.detectChanges();
                    tick();
                }));

                describe('Search', () => {
                    beforeEach(fakeAsync(() => {
                        Helper.raiseClickEvent(searchButton.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should emit generate event with right parameters', () => {
                        expect(generateSpy.calls.count()).toBe(1);
                        const args = generateSpy.calls.mostRecent().args;
                        const expectedFilterModel: FilterModel = {
                            productId: 1,
                            productName: 'Product 1',
                            siteId: 0,
                            isCreditSite: false,
                            currencyId: 1,
                            excludeTestCurrency: false
                        };
                        expect(args[0]).toEqual(expectedFilterModel);
                    });
                });
            });

            describe('Select "Credit 1"', () => {
                beforeEach(fakeAsync(() => {
                    queryCurrenciesSpy.calls.reset();
                    siteSelectHelper.selectOptionByText('Credit 1');
                    fixture.detectChanges();
                    tick();
                }));

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

                describe('Search', () => {
                    beforeEach(fakeAsync(() => {
                        Helper.raiseClickEvent(searchButton.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should emit generate event with right parameters', () => {
                        expect(generateSpy.calls.count()).toBe(1);
                        const args = generateSpy.calls.mostRecent().args;
                        const expectedFilterModel: FilterModel = {
                            productId: 1,
                            productName: 'Product 1',
                            siteId: 1,
                            isCreditSite: true,
                            currencyId: 0,
                            excludeTestCurrency: false
                        };
                        expect(args[0]).toEqual(expectedFilterModel);
                    });
                });

                describe('Select "Product 1"', () => {
                    beforeEach(fakeAsync(() => {
                        queryCurrenciesSpy.calls.reset();
                        productSelectHelper.selectOptionByText('Product 1');
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should display site "All"', () => {
                        const textContent = siteSelectHelper.getTextOfSelectElement();
                        expect(textContent).toBe('All');
                    });
                });
            });

            describe('Select "Deposit 1"', () => {
                beforeEach(fakeAsync(() => {
                    queryCurrenciesSpy.calls.reset();
                    siteSelectHelper.selectOptionByText('Deposit 1');
                    fixture.detectChanges();
                    tick();
                }));

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
        });

        describe('SiteGroups without Credit', () => {
            describe('Select "Product 2"', () => {
                beforeEach(fakeAsync(() => {
                    querySitesSpy.calls.reset();
                    productSelectHelper.selectOptionByText('Product 2');
                    fixture.detectChanges();
                    tick();
                }));

                it('should invoke querySites with right parameters and display sites', () => {
                    expect(querySitesSpy.calls.count()).toBe(1);
                    const args = querySitesSpy.calls.mostRecent().args;
                    expect(args[0]).toBe(2);
                    const selectText = siteSelectHelper.getTextOfSelectElement();
                    expect(selectText).toBe('All');
                    const textContents = siteSelectHelper.getOptionContents();
                    expect(textContents).toEqual(['All', 'Deposit 1', 'Deposit 2']);
                });

                describe('Search', () => {
                    beforeEach(fakeAsync(() => {
                        Helper.raiseClickEvent(searchButton.nativeElement);
                        fixture.detectChanges();
                        tick();
                    }));

                    it('should emit generate event with right parameters', () => {
                        expect(generateSpy.calls.count()).toBe(1);
                        const args = generateSpy.calls.mostRecent().args;
                        const expectedFilterModel: FilterModel = {
                            productId: 2,
                            productName: 'Product 2',
                            siteId: 0,
                            isCreditSite: false,
                            currencyId: 0,
                            excludeTestCurrency: false
                        };
                        expect(args[0]).toEqual(expectedFilterModel);
                    });
                });
            });
        });
    });
});
