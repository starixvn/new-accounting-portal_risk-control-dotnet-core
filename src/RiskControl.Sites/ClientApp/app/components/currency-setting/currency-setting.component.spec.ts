import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrencySettingComponent } from './currency-setting.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CurrencySettingComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(CurrencySettingComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as header title 'Currency Win Loss Limit Setting'`, async(() => {
    const fixture = TestBed.createComponent(CurrencySettingComponent);
    const headerTitle = fixture.debugElement.query(By.css('.header-title'));
    expect(headerTitle.nativeElement.textContent.trim()).toEqual('Currency Win Loss Limit Setting');
  }));
});
