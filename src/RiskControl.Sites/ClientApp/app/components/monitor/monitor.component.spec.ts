import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MonitorComponent } from './monitor.component';

describe('MonitorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MonitorComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(MonitorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(MonitorComponent);
    fixture.detectChanges();
    const headerTitle = fixture.debugElement.query(By.css('.header-title'));
    expect(headerTitle.nativeElement.textContent.trim()).toEqual('Win Loss Limit Monitor');
  }));
});
