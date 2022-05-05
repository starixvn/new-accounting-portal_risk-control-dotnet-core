import { ProductGameType } from './../../common/filter/filter.model';
import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import 'rxjs/add/observable/of';
import { NapDate } from 'nap-components/date';
import { FilterComponent, FilterModel, FilterModule } from './index';
import { expect, DropdownTreeviewHelper } from '../../testing';
import { FilterService } from 'common/filter';
import { of } from 'rxjs';

describe('FilterComponent', () => {
  let fixture: ComponentFixture<FilterComponent>;
  let component: FilterComponent;
  let queryProductGameTypesSpy: jasmine.Spy;
  let valueChangeSpy: jasmine.Spy;
  const fakeProductGameTypes: ProductGameType[] = [
    { ProductId: 21, ProductName: 'AE Casino', BettypeName: 'Game Type 1', Bettype: 1 },
    { ProductId: 21, ProductName: 'AE Casino', BettypeName: 'Game Type 2', Bettype: 2 },
    { ProductId: 12, ProductName: 'Gold Deluxe', BettypeName: 'Game Type 3', Bettype: 3 },
    { ProductId: 12, ProductName: 'Gold Deluxe', BettypeName: 'Game Type 4', Bettype: 4 }
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FilterModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    const filterService = fixture.debugElement.injector.get(FilterService);
    queryProductGameTypesSpy = spyOn(filterService, 'queryProductGameTypes').and.returnValue(of(fakeProductGameTypes));

    valueChangeSpy = spyOn(component.valueChange, 'emit');
    fixture.detectChanges();
  }));

  describe('OnInit', () => {
    let productTreeViewElement: DebugElement;
    let productTreeViewHelper: DropdownTreeviewHelper;

    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      productTreeViewElement = fixture.debugElement.query(
        By.css('ngx-dropdown-treeview')
      );
      productTreeViewHelper = new DropdownTreeviewHelper(
        productTreeViewElement
      );
    }));

    it('should show product treeview with 2 products', async () => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        productTreeViewElement = fixture.debugElement.query(
          By.css('#product-tree-view')
        );
        productTreeViewHelper = new DropdownTreeviewHelper(
          productTreeViewElement
        );
        const selectText = productTreeViewHelper.getDropdownText();
        expect(selectText).toBe('All');
        const isHasAllItem = productTreeViewHelper.hasAllItem();
        expect(isHasAllItem).toBeTruthy();
        const textContents = productTreeViewHelper.getItemContents();
        expect(textContents).toEqual([
          { text: 'AE Casino' },
          { text: 'Gold Deluxe' }
        ]);
      });
    });

    describe('onProductChange', () => {
      it('should set selectedProducts as event value', async () => {
        fixture.whenStable().then(() => {
          fixture.componentInstance.onProductChange([1, 2, 3]);
          fixture.detectChanges();
          expect(fixture.componentInstance.selectedProducts).toEqual([1, 2, 3]);
        });
      });
    });

    describe('search', () => {
      it('should emit event with selectedProducts and selectedGameTypes', async () => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          fixture.componentInstance.search();
          expect(valueChangeSpy.calls.any()).toBeTruthy();
          const args = valueChangeSpy.calls.mostRecent().args;
          const today = NapDate.fromToday();
          const expectedFilterModel: FilterModel = {
            productIds: '21,12'
          };
          expect(args[0]).toEqual(expectedFilterModel);
        });
      });
    });
  });
});
