import * as _ from 'lodash';
import { GridComponent } from './grid.component';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
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
import { expect } from '../../testing';
import { GridService } from './grid.service';
import { SettingModel } from './grid.model';
import { NumericTextboxModule } from 'ngx-numeric-textbox';
import { NoteModule } from 'nap-components/note';
import { ConfirmationModule } from 'nap-components/confirmation';
import { ToastService, MessageType } from 'nap-components/toast';
import { ConfirmationService } from 'nap-components/confirmation';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let gridServiceQuerySpy: jasmine.Spy;
  let gridServiceHostSpy: jasmine.Spy;
  let gridServiceUpdateSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        BreadcrumbModule,
        ConfirmationModule.forRoot(),
        NumberFormatModule,
        NoteModule,
        NumericTextboxModule
      ],
      declarations: [GridComponent],
      providers: [GridService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;

    const fakeSettingModels = createFakeSettingModels();
    const gridService = fixture.debugElement.injector.get(GridService);
    gridServiceQuerySpy = spyOn(gridService, 'query').and.returnValue(
      Observable.of(fakeSettingModels)
    );
    gridServiceHostSpy = spyOn(
      gridService,
      'hasHostPermission'
    ).and.returnValue(Observable.of(true));
    gridServiceUpdateSpy = spyOn(gridService, 'update').and.returnValue(
      Observable.of('OK')
    );

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

  function createFakeSettingModels() {
    const fakeSettingModels: SettingModel[] = [];
    const fakeSettingModel: SettingModel = {
      ProductId: 1,
      BetType: 1,
      SportType: 1,
      ProductName: 'Product 1',
      BetTypeName: 'Bet Type 1',
      GameRoundBetLimit: 10000
    };
    fakeSettingModels.push(fakeSettingModel);

    return fakeSettingModels;
  }

  describe('ngOnInit', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should invoke gridService.hasHostPermission', () => {
      expect(gridServiceHostSpy.calls.count()).toBe(1);
    });
  });

  describe('ngOnChanges-filterModel is null', () => {
    beforeEach(fakeAsync(() => {
      fixture.componentInstance.filterModel = null;
      fixture.componentInstance.ngOnChanges();

      fixture.detectChanges();
      tick();
    }));

    it('should  not invoke gridService.query', () => {
      expect(gridServiceQuerySpy.calls.count()).toBe(0);
    });
  });

  describe('ngOnChanges-filterModel is not null', () => {
    let gridElement: DebugElement;

    beforeEach(fakeAsync(() => {
      fixture.componentInstance.filterModel = { productIds: '1,2' };
      fixture.componentInstance.ngOnChanges();

      fixture.detectChanges();
      tick();

      gridElement = fixture.debugElement.query(By.css('.nap-grid .body'));
    }));

    it('should invoke gridService.query', () => {
      expect(gridServiceQuerySpy.calls.count()).toBe(1);
    });

    it('should show grid table with right value in 1 row', () => {
      const row = gridElement.query(By.css('tr'));
      expectRowContents(row, ['1', 'Product 1', 'Bet Type 1', '(RM)']);

      const input = row.query(By.css('input'));
      expect(input.nativeElement.value).toBe('10,000');
    });
  });

  describe('cancel', () => {
    let gridElement: DebugElement;

    beforeEach(fakeAsync(() => {
      fixture.componentInstance.filterModel = { productIds: '1,2' };
      fixture.componentInstance.ngOnChanges();

      fixture.detectChanges();
      tick();

      gridElement = fixture.debugElement.query(By.css('.nap-grid .body'));
      const input = gridElement.query(By.css('input'));
      input.nativeElement.value = '12,000';

      const cancelButton = fixture.debugElement.queryAll(By.css('button'))[1];
      cancelButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      tick();
    }));

    it('should reset all bet limit setting value', () => {
      gridElement = fixture.debugElement.query(By.css('.nap-grid .body'));
      const input = gridElement.query(By.css('input'));
      expect(input.nativeElement.value).toBe('10,000');
    });
  });

  describe('Save with no change', () => {
    let toastServiceSpy: jasmine.Spy;
    beforeEach(fakeAsync(() => {
      const toastService = fixture.debugElement.injector.get(ToastService);
      toastServiceSpy = spyOn(toastService, 'activate');
      fixture.componentInstance.filterModel = { productIds: '1,2' };
      fixture.componentInstance.ngOnChanges();
      fixture.detectChanges();
      tick();

      const saveButton = fixture.debugElement.queryAll(By.css('button'))[0];
      saveButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      tick();
    }));

    it('should activate toast with message "There is no change to save"', () => {
      expect(toastServiceSpy.calls.any()).toBeTruthy();
      const args = toastServiceSpy.calls.mostRecent().args;
      expect(args[0]).toBe('There is no change to save');
      expect(args[1]).toBe(MessageType.Warning);
    });
  });

  describe('Save with valid change', () => {
    let confirmationServiceSpy: jasmine.Spy;
    let validInput: DebugElement;
    let okButton: HTMLElement;
    let cancelButton: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture.componentInstance.filterModel = { productIds: '1,2' };
      fixture.componentInstance.ngOnChanges();
      fixture.detectChanges();
      tick();

      const confirmationService = fixture.debugElement.injector.get(
        ConfirmationService
      );
      confirmationServiceSpy = spyOn(
        confirmationService,
        'openContent'
      ).and.callThrough();

      validInput = fixture.debugElement.query(By.css('.nap-grid .body input'));
      validInput.nativeElement.value = '5000';
      validInput.nativeElement.dispatchEvent(new Event('input'));

      const saveButton = fixture.debugElement.queryAll(By.css('button'))[0];
      saveButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      tick();

      okButton = document.querySelector(
        '.modal-content .btn-primary'
      ) as HTMLElement;
      cancelButton = document.querySelector(
        '.modal-content .btn-danger'
      ) as HTMLElement;
    }));

    afterEach(() => {
      cancelButton.click();
      fixture.detectChanges();
    });

    it('should invoke confirmation with message "Are you sure want to change this setting?"', () => {
      expect(confirmationServiceSpy.calls.any()).toBeTruthy();
      const args = confirmationServiceSpy.calls.mostRecent().args;
      expect(args[0]).toBe('Are you sure want to change this setting?');
    });

    describe('Click Yes on confirmation', () => {
      let toastServiceSpy: jasmine.Spy;
      beforeEach(() => {
        const toastService = fixture.debugElement.injector.get(ToastService);
        toastServiceSpy = spyOn(toastService, 'activate');
      });

      describe('Saving success', () => {
        beforeEach(fakeAsync(() => {
          okButton.click();
          fixture.detectChanges();
          tick();
        }));

        it('should invoke update method & show success message in 3 seconds', () => {
          expect(gridServiceUpdateSpy.calls.count()).toBe(1);
          expect(toastServiceSpy.calls.any()).toBeTruthy();
          const args = toastServiceSpy.calls.mostRecent().args;
          const message = 'The setting has been updated successfully!';
          expect(args[0]).toBe(message);
          expect(args[1]).toBe(MessageType.Success);
          expect(args[2]).toBe(3);
        });

        it('should update settingModels as displayModels', () => {
          expect(fixture.componentInstance.settingModels).toEqual(
            fixture.componentInstance.displayModels
          );
        });
      });
    });

    describe('Click Cancel on confirmation', () => {
      beforeEach(fakeAsync(() => {
        cancelButton.click();
        fixture.detectChanges();
        tick();
      }));

      it('should not invoke update method', () => {
        expect(gridServiceUpdateSpy.calls.count()).toBe(0);
      });
    });
  });
});
