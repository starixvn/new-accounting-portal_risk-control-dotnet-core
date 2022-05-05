import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountComponent, AccountModel, AccountModule } from './index';
import { expect } from '../../testing';
import { fakeAccountModelsWith3AssociatedUsers, fakeAccountModelsWithNoAssociatedUsers } from './account.model.spec';

describe('ModalAccountComponent', () => {
  let fixture: ComponentFixture<AccountComponent>;
  let component: AccountComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AccountModule
      ], providers: [
        { provide: NgbActiveModal }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
  });

  describe('empty data', () => {
    beforeEach(() => {
      component.show(fakeAccountModelsWithNoAssociatedUsers);
      fixture.detectChanges();
    });

    it('should show right customer information', () => {
      const table = fixture.debugElement.query(By.css('.account-information table'));
      const rows = table.queryAll(By.css('tbody tr'));
      const cellContents = rows.map(row => row.queryAll(By.css('td'))[1].nativeElement.textContent.trim());
      expect(cellContents).toEqual(['User 1 (1)', 'Agent 1 (2)', 'Master 1 (3)', 'Super 1 (4)']);
    });

    it('should have two table to show message "There is no data"', () => {
      const noDataCells = fixture.debugElement.queryAll(By.css('.no-data'));
      expect(noDataCells.length).toBe(2);
    });
  });

  describe('data with 3 associated users', () => {
    beforeEach(() => {
      component.show(fakeAccountModelsWith3AssociatedUsers);
      fixture.detectChanges();
    });

    it('should have table associated users by device with 3 rows', () => {
      const table = fixture.debugElement.query(By.css('.test-associated-users-by-device'));
      const rows = table.queryAll(By.css('tr'));
      expect(rows.length).toBe(3);
    });

    it('should have table associated users by ip with 3 rows', () => {
      const table = fixture.debugElement.query(By.css('.test-associated-users-by-ip'));
      const rows = table.queryAll(By.css('tr'));
      expect(rows.length).toBe(3);
    });

    it('should have first row of associated users by device with right data', () => {
      const table = fixture.debugElement.query(By.css('.test-associated-users-by-device'));
      const cells = table.queryAll(By.css('tr'))[0].queryAll(By.css('td'));
      const cellValues = [];
      for (const cell of cells) {
        cellValues.push(cell.nativeElement.innerText);
      }
      const expectedValues = [
        '1',
        '1',
        '1',
        '01/01/2017 00:00:00 AM'
      ];
      expect(cellValues).toEqual(expectedValues);
    });

    it('should have first row of associated users by device with right data', () => {
      const table = fixture.debugElement.query(By.css('.test-associated-users-by-ip'));
      const cells = table.queryAll(By.css('tr'))[0].queryAll(By.css('td'));
      const cellValues = [];
      for (const cell of cells) {
        cellValues.push(cell.nativeElement.innerText);
      }
      const expectedValues = [
        '1',
        '1',
        '1',
        '01/01/2017 00:00:00 AM'
      ];
      expect(cellValues).toEqual(expectedValues);
    });
  });

  describe('toggle expand associated users', () => {
    beforeEach(() => {
      component.show(fakeAccountModelsWith3AssociatedUsers);
      fixture.detectChanges();
    });

    it('set userByDeviceIsExpanded to false if userByDeviceIsExpanded is true', () => {
      component.userByDeviceIsExpanded = true;
      component.toggleUserByDevice();
      expect(component.userByDeviceIsExpanded).toBe(false);
    });

    it('set userByDeviceIsExpanded to true if userByDeviceIsExpanded is false', () => {
      component.userByDeviceIsExpanded = false;
      component.toggleUserByDevice();
      expect(component.userByDeviceIsExpanded).toBe(true);
    });

    it('set userByIPIsExpanded to false if userByIPIsExpanded is true', () => {
      component.userByIPIsExpanded = true;
      component.toggleUserByIP();
      expect(component.userByIPIsExpanded).toBe(false);
    });

    it('set userByIPIsExpanded to true if userByIPIsExpanded is false', () => {
      component.userByIPIsExpanded = false;
      component.toggleUserByIP();
      expect(component.userByIPIsExpanded).toBe(true);
    });
  });
});
