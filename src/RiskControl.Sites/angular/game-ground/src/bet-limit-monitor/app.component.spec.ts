import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync as  } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const headerTitle = fixture.debugElement.query(By.css('.title .active'));
    expect(headerTitle.nativeElement.textContent.trim()).toEqual(
      'Game Round Bet Limit Monitor'
    );
  }));
});
