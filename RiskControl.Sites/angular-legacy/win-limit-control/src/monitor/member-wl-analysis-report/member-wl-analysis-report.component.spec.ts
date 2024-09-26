import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberWlAnalysisReportComponent } from './member-wl-analysis-report.component';

describe('MemberWlAnalysisReportComponent', () => {
  let component: MemberWlAnalysisReportComponent;
  let fixture: ComponentFixture<MemberWlAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberWlAnalysisReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberWlAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
