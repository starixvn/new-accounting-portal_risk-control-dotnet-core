import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'nap-components/http';
import { GroupSettingModule, GroupSettingService, ProductBetTypeSetting } from './index';
import { fakeProductBetTypeSettings } from './group-setting.model.spec';

describe('GroupSettingService', () => {
    let groupSettingService: GroupSettingService;
    let updateSettingsSpy: jasmine.Spy;
    let modalServiceSpy: jasmine.Spy;
    let httpServiceSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                GroupSettingModule.forRoot()
            ]
        });

        const modalService = TestBed.get(NgbModal);
        const httpService = TestBed.get(HttpService);
        groupSettingService = TestBed.get(GroupSettingService);
        const modalRef = {
            componentInstance: {
                updateSettings: () => { }
            }
        };
        updateSettingsSpy = spyOn(modalRef.componentInstance, 'updateSettings');
        modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalRef);
        httpServiceSpy = spyOn(httpService, 'post').and.returnValue(Observable.of(fakeProductBetTypeSettings));
        groupSettingService.show(1, 'Product 1');
    });

    it('should show modal', () => {
        let args = httpServiceSpy.calls.mostRecent().args;
        expect(args[0]).toBe('api/win-limit-control/group-settings');
        expect(args[1]).toEqual({
            cache: true
        });
        expect(modalServiceSpy.calls.any()).toBeTruthy();
        expect(updateSettingsSpy.calls.any()).toBeTruthy();
        args = updateSettingsSpy.calls.mostRecent().args;
        expect(args[0]).toBe(fakeProductBetTypeSettings);
        expect(args[1]).toBe('Product 1');

        describe('Show the second time', () => {
            it('should not query again', () => {
                httpServiceSpy.calls.reset();
                groupSettingService.show(1, 'Product 1');
                expect(httpServiceSpy.calls.any()).toBeFalsy();
            });
        });
    });

    it('should not query again after invoking to show modal again', () => {
        httpServiceSpy.calls.reset();
        groupSettingService.show(1, 'Product 1');
        expect(httpServiceSpy.calls.any()).toBeFalsy();
    });
});
