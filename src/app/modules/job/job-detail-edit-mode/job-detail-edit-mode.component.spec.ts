import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailEditModeComponent } from './job-detail-edit-mode.component';

describe('JobDetailEditModeComponent', () => {
  let component: JobDetailEditModeComponent;
  let fixture: ComponentFixture<JobDetailEditModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailEditModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailEditModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
