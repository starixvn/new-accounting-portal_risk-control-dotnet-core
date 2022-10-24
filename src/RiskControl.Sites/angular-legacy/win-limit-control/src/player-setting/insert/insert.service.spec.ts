import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsertService, InsertModule } from './index';

describe('InsertService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                InsertModule
            ]
        });
    });

    it('should show modal', inject([NgbModal, InsertService], (modalService: NgbModal, insertService: InsertService) => {
        const spy = spyOn(modalService, 'open').and.callThrough();
        insertService.show();
        expect(spy.calls.any()).toBeTruthy();
    }));
});
