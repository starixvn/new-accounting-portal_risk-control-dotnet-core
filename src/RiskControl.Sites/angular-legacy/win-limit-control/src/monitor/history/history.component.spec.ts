import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryComponent, HistoryModel, HistoryModule, Columns } from './index';
import { expect } from '../../testing';
import { fakeHistoryModelsWith3Items, fakeHistoryModelsWithNoItems } from './history.model.spec';

class Page {
  constructor(
    private fixture: ComponentFixture<HistoryComponent>
  ) { }

  queryEntityRow(rowIndex: number): DebugElement {
    const tableDebugElements = this.fixture.debugElement.queryAll(By.css('table'));
    const trs = tableDebugElements[1].queryAll(By.css('tr'));
    return trs[rowIndex];
  }
}

describe('ModalHistoryComponent', () => {
  let fixture: ComponentFixture<HistoryComponent>;
  let component: HistoryComponent;
  let page: Page;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HistoryModule
      ], providers: [
        NgbActiveModal
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  describe('empty data', () => {
    beforeEach(() => {
      component.show(fakeHistoryModelsWithNoItems, 'username', 'productname');
      fixture.detectChanges();
    });

    it('should have a table to show message "There is no data"', () => {
      const noDataCell = fixture.debugElement.queryAll(By.css('.no-data'));
      expect(noDataCell.length).toBe(1);
    });
  });

  describe('data with 3 items', () => {
    beforeEach(() => {
      component.show(fakeHistoryModelsWith3Items, 'username', 'productname');
    });

    describe('Default selected columns', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should have two table with 3 rows', () => {
        const table = fixture.debugElement.query(By.css('.test-body-table'));
        const rows = table.queryAll(By.css('tr'));
        expect(rows.length).toBe(3);
      });

      it('should have first row with right data', () => {
        const table = fixture.debugElement.query(By.css('.test-body-table'));
        const cells = table.queryAll(By.css('tr'))[0].queryAll(By.css('td'));
        const cellValues = cells.map(cell => cell.nativeElement.innerText);
        const expectedValues = ['1', '01/01/2017 00:00:00 AM', '1', '1', '1', '', '1', '1'];
        expect(cellValues).toEqual(expectedValues);
      });
    });

    describe('Show win limit columns', () => {
      beforeEach(() => {
        const selectedColumns = [
          Columns.no,
          Columns.date,
          Columns.settingGroup,
          Columns.winLimitLevel,
          Columns.winningLosingAmountRM,
          Columns.winningLosingAmountInPlayerCurrency,
          Columns.reachedLimitLevel,
          Columns.action,
          Columns.proceededBy
        ];
        component.onColumnChange(selectedColumns);
        fixture.detectChanges();
      });

      it('should have first row with right data', () => {
        const table = fixture.debugElement.query(By.css('.test-body-table'));
        const cells = table.queryAll(By.css('tr'))[0].queryAll(By.css('td'));
        const cellValues = cells.map(cell => cell.nativeElement.innerText);
        const expectedValues = ['1', '01/01/2017 00:00:00 AM', '1', '1', '1', '1', '1', '1', '', '1', '1'];
        expect(cellValues).toEqual(expectedValues);
      });
    });

    describe('Show loss limit columns', () => {
      beforeEach(() => {
        const selectedColumns = [
          Columns.no,
          Columns.date,
          Columns.settingGroup,
          Columns.lossLimitLevel,
          Columns.winningLosingAmountRM,
          Columns.winningLosingAmountInPlayerCurrency,
          Columns.reachedLimitLevel,
          Columns.action,
          Columns.proceededBy
        ];
        component.onColumnChange(selectedColumns);
        fixture.detectChanges();
      });

      it('should have first row with right data', () => {
        const table = fixture.debugElement.query(By.css('.test-body-table'));
        const cells = table.queryAll(By.css('tr'))[0].queryAll(By.css('td'));
        const cellValues = cells.map(cell => cell.nativeElement.innerText);
        const expectedValues = ['1', '01/01/2017 00:00:00 AM', '1', '-1', '-1', '1', '1', '', '1', '1'];
        expect(cellValues).toEqual(expectedValues);
      });
    });

    describe('Show both win and loss limit columns', () => {
      beforeEach(() => {
        const selectedColumns = [
          Columns.no,
          Columns.date,
          Columns.settingGroup,
          Columns.lossLimitLevel,
          Columns.winLimitLevel,
          Columns.winningLosingAmountRM,
          Columns.winningLosingAmountInPlayerCurrency,
          Columns.reachedLimitLevel,
          Columns.action,
          Columns.proceededBy
        ];
        component.onColumnChange(selectedColumns);
        fixture.detectChanges();
      });

      it('should have first row with right data', () => {
        const table = fixture.debugElement.query(By.css('.test-body-table'));
        const cells = table.queryAll(By.css('tr'))[0].queryAll(By.css('td'));
        const cellValues = cells.map(cell => cell.nativeElement.innerText);
        const expectedValues = ['1', '01/01/2017 00:00:00 AM', '1', '-1', '-1', '1', '1', '1', '1', '1', '', '1', '1'];
        expect(cellValues).toEqual(expectedValues);
      });
    });
  });
});
