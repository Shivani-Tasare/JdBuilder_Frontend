import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidatesPieChartComponent } from './view-candidates-pie-chart.component';

describe('ViewCandidatesPieChartComponent', () => {
  let component: ViewCandidatesPieChartComponent;
  let fixture: ComponentFixture<ViewCandidatesPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCandidatesPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidatesPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
