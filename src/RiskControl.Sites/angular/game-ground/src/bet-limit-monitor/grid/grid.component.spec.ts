import * as _ from 'lodash';
import { GridComponent } from './grid.component';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
import { PaginationModule, PaginationConfig } from 'nap-components/pagination';
import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NapDate } from 'nap-components/date';
import { expect } from '../../testing';
import { GridService } from './grid.service';
import { MonitorModel } from './grid.model';

export class CustomPaginationConfig extends PaginationConfig {
  pageSizes = [2, 4, 6];
  itemsPerPage = 2;
}

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let gridServiceQuerySpy: jasmine.Spy;
  let gridServiceExportExcelSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        BreadcrumbModule,
        NgxPaginationModule,
        NumberFormatModule,
        PaginationModule.forRoot(),
        HttpModule.forRoot()
      ],
      declarations: [GridComponent],
      providers: [
        { provide: PaginationConfig, useClass: CustomPaginationConfig },
        GridService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;

    const fakeMonitorModels = createFakeMonitorModels();
    const gridService = fixture.debugElement.injector.get(GridService);
    gridServiceQuerySpy = spyOn(gridService, 'query').and.returnValue(
      Observable.of(fakeMonitorModels)
    );
    gridServiceExportExcelSpy = spyOn(gridService, 'exportExcel');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function expectRowContents(row: DebugElement, contents: string[]) {
    const cells = row.queryAll(By.css('td'));
    const cellContents = cells.map(cell =>
      cell.nativeElement.textContent.trim()
    );
    expect(cellContents).toEqual(contents);
  }

  function createFakeMonitorModels() {
    const fakeMonitorModels: MonitorModel[] = [];
    for (let i = 1; i <= 6; i++) {
      const fakeMonitorModel: MonitorModel = {
        Index: i,
        ProductName: 'Product 1',
        BetTypeName: 'Bet Type 1',
        GameRound: 'Game Round 1',
        GameRoundBetLimit: 10000,
        BetCount: i * 5,
        NoOfPlayers: i * 2,
        TotalStake: 50 * i,
        ReachedLimitTime: new Date('01/01/2020')
      };
      fakeMonitorModels.push(fakeMonitorModel);
    }

    return fakeMonitorModels;
  }

  describe('ngOnChanges-filterModel is null', () => {
    beforeEach(fakeAsync(() => {
      fixture.componentInstance.filterModel = null;
      fixture.componentInstance.ngOnChanges();

      fixture.detectChanges();
      tick();
    }));

    it('should not invoke gridService.query', () => {
      expect(gridServiceQuerySpy.calls.count()).toBe(0);
    });
  });

  describe('ngOnChanges-filterModel is not null', () => {
    let gridElement: DebugElement;
    let paginationElement: DebugElement;
    let exportExcelElement: DebugElement;

    beforeEach(fakeAsync(() => {
      const today = NapDate.fromToday();
      fixture.componentInstance.filterModel = {
        fromDate: today,
        toDate: today,
        productIds: '1,2',
        gameTypes: '1,2',
        excludeTestData: true
      };
      fixture.componentInstance.ngOnChanges();

      fixture.detectChanges();
      tick();

      gridElement = fixture.debugElement.query(By.css('.nap-grid .body'));
      exportExcelElement = fixture.debugElement.query(
        By.css('.nap-icon-breadcrumb-excel')
      );
      paginationElement = fixture.debugElement.query(
        By.css('pagination-template select')
      );
    }));

    it('should invoke gridService.query', () => {
      expect(gridServiceQuerySpy.calls.count()).toBe(1);
    });

    it('should show export excel icon', () => {
      expect(exportExcelElement).toBeDefined();
    });

    it('should show pagination with 3 page size options', () => {
      const options = paginationElement.queryAll(By.css('option'));
      const textContents = _.map(options, o => {
        return o.nativeElement.textContent.trim();
      });
      const selectedPageSize = paginationElement.nativeElement.value;
      expect(textContents).toEqual(['2', '4', '6']);
      expect(selectedPageSize).toBe('2');
    });

    it('should show grid table with value of first page', () => {
      const row1 = gridElement.queryAll(By.css('tr'))[0];
      const row2 = gridElement.queryAll(By.css('tr'))[1];
      expectRowContents(row1, [
        '1',
        'Product 1',
        'Bet Type 1',
        'Game Round 1',
        '10,000',
        '5',
        '2',
        '50',
        '01/01/2020 12:00:00 AM'
      ]);
      expectRowContents(row2, [
        '2',
        'Product 1',
        'Bet Type 1',
        'Game Round 1',
        '10,000',
        '10',
        '4',
        '100',
        '01/01/2020 12:00:00 AM'
      ]);
    });
  });

  describe('exportExcel', () => {
    beforeEach(fakeAsync(() => {
      const today = NapDate.fromToday();
      fixture.componentInstance.filterModel = {
        fromDate: today,
        toDate: today,
        productIds: '1,2',
        gameTypes: '1,2',
        excludeTestData: true
      };
      fixture.componentInstance.ngOnChanges();

      fixture.detectChanges();
      tick();

      const exportExcelElement = fixture.debugElement.query(
        By.css('.nap-icon-breadcrumb-excel')
      );
      exportExcelElement.triggerEventHandler('click', null);

      fixture.detectChanges();
      tick();
    }));

    it('should invoke gridService.exportExcel', () => {
      expect(gridServiceExportExcelSpy.calls.count()).toBe(1);
    });
  });

  describe('onPageChange', () => {
    let gridElement: DebugElement;
    beforeEach(fakeAsync(() => {
      const today = NapDate.fromToday();
      fixture.componentInstance.filterModel = {
        fromDate: today,
        toDate: today,
        productIds: '1,2',
        gameTypes: '1,2',
        excludeTestData: true
      };
      fixture.componentInstance.ngOnChanges();

      fixture.detectChanges();
      tick();

      const linkToSecondPage = fixture.debugElement.queryAll(
        By.css('.pagination .page-item')
      )[2];
      linkToSecondPage.nativeElement.click();

      fixture.detectChanges();
      tick();
    }));

    it('should show grid table with value of second page', () => {
      gridElement = fixture.debugElement.query(By.css('.nap-grid .body'));
      const row1 = gridElement.queryAll(By.css('tr'))[0];
      const row2 = gridElement.queryAll(By.css('tr'))[1];
      expectRowContents(row1, [
        '1',
        'Product 1',
        'Bet Type 1',
        'Game Round 1',
        '10,000',
        '5',
        '2',
        '50',
        '01/01/2020 12:00:00 AM'
      ]);
      expectRowContents(row2, [
        '2',
        'Product 1',
        'Bet Type 1',
        'Game Round 1',
        '10,000',
        '10',
        '4',
        '100',
        '01/01/2020 12:00:00 AM'
      ]);
    });
  });
});
