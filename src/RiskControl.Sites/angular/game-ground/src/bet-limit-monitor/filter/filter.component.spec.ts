import { GameType, ProductGameType } from './../../common/filter/filter.model';
import {
  TestBed,
  async,
  ComponentFixture
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import 'rxjs/add/observable/of';
import * as moment from 'moment';
import { NapDate } from 'nap-components/date';
import { FilterService } from '../../common/filter';
import { FilterComponent, FilterModel, FilterModule } from './index';
import { expect, DropdownTreeviewHelper } from '../../testing';
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
    let gameTypeTreeViewElement: DebugElement;
    let productTreeViewHelper: DropdownTreeviewHelper;
    let gameTypeTreeViewHelper: DropdownTreeviewHelper;

    it('should invoke queryProductGameTypes', async () => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(queryProductGameTypesSpy.calls.count()).toBe(1);
      });
    });

    it('should show "from date" as today', async () => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const dateFrom = fixture.debugElement.queryAll(By.css('input'))[0];
        const todayString = moment().format('MMM D, YYYY');
        expect(dateFrom.nativeElement.value).toEqual(todayString);
      });
    });

    it('should show "to date" as today', async () => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const dateTo = fixture.debugElement.queryAll(By.css('input'))[1];
        const todayString = moment().format('MMM D, YYYY');
        expect(dateTo.nativeElement.value).toEqual(todayString);
      });
    });

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

    it('should show game type treeview with 2 products', async () => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        gameTypeTreeViewElement = fixture.debugElement.query(
          By.css('#game-type-tree-view')
        );
        gameTypeTreeViewHelper = new DropdownTreeviewHelper(
          gameTypeTreeViewElement
        );
        const selectText = gameTypeTreeViewHelper.getDropdownText();
        expect(selectText).toBe('All');
        const isHasAllItem = gameTypeTreeViewHelper.hasAllItem();
        expect(isHasAllItem).toBeTruthy();
        const textContents = gameTypeTreeViewHelper.getItemContents();
        expect(textContents).toEqual([
          {
            text: 'AE Casino',
            children: [
              { text: 'Game Type 1' },
              { text: 'Game Type 2' }]
          },
          {
            text:
              'Gold Deluxe',
            children: [
              { text: 'Game Type 3' },
              { text: 'Game Type 4' }]
          }]);
      });
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

  describe('onGameTypeChange', () => {

    it('should set selectedGameTypes as event value', () => {
      fixture.whenStable().then(() => {
        fixture.componentInstance.onGameTypeChange([1, 2, 3]);
        fixture.detectChanges();
        expect(fixture.componentInstance.selectedGameTypes).toEqual([1, 2, 3]);
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
          fromDate: today,
          toDate: today,
          productIds: '21,12',
          gameTypes: '1,2,3,4',
          excludeTestData: true
        };
        expect(args[0]).toEqual(expectedFilterModel);
      });
    });
  });
});
