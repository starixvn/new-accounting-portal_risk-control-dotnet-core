import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpService, DefaultHttpOptions, HttpOptions } from 'nap-components/http';
import { CommandResult } from '../../common/model';
import { FilterModel } from '../filter';
import { GridModule, GridService, ProductSetting, ProductSettingGroup } from './index';

describe('GridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                GridModule
            ],
            providers: [
                GridService
            ]
        });
    });

    it('should invoke query method with right parameters and returns data of httpService',
        inject([HttpService, GridService], (httpService: HttpService, gridService: GridService) => {
            const productSetting: ProductSetting[] = [];
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(productSetting));
            const filterModel: FilterModel = {
                productId: 1,
                productName: 'Product 1',
                siteId: 1,
                isCreditSite: true,
                currencyId: 1,
                excludeTestCurrency: true
            };

            function verify(httpOptions: HttpOptions, expectedHttpOptions: HttpOptions) {
                let result: Observable<ProductSetting[]>;
                if (httpOptions) {
                    result = gridService.query(filterModel, httpOptions);
                } else {
                    result = gridService.query(filterModel);
                }

                const args = spy.calls.mostRecent().args;
                expect(args[0]).toBe('api/win-limit-control/currency-setting/search');
                expect(args[1]).toEqual(filterModel);
                expect(args[2]).toBe(expectedHttpOptions);
                result.subscribe(models => {
                    expect(models).toEqual(productSetting);
                });
            }

            verify(undefined, DefaultHttpOptions);
            const options: HttpOptions = {
                noSpinner: true
            };
            verify(options, options);
        }));

    it('should invoke update method with right parameters and returns data of httpService',
        inject([HttpService, GridService], (httpService: HttpService, gridService: GridService) => {
            const commandResult: CommandResult = {
                ErrorCode: 0
            };
            const spy = spyOn(httpService, 'post').and.returnValue(Observable.of(commandResult));
            const productSettingGroups: ProductSettingGroup[] = [{
                ProductId: 1,
                CurrencyId: 1,
                SiteId: 1,
                GroupId: 1,
                GroupName: '1',
                IsBlockedPlacebetRedLevel: true,
                IsBlockedTransferRedLevel: true,
                IsCreditSite: true,
                BlackLimit: 1,
                GreyLimit: 1,
                OrangeLimit: 1,
                YellowLimit: 1,
                RedLimit: 1
            }];
            const result = gridService.update(productSettingGroups);
            const args = spy.calls.mostRecent().args;
            expect(args[0]).toBe('state-api/win-limit-control/currency-setting/update');
            expect(args[1]).toEqual(productSettingGroups);
            result.subscribe(model => {
                expect(model).toEqual(commandResult);
            });
        }));
});
