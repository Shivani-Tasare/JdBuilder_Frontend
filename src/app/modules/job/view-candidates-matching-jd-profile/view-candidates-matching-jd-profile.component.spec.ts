import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidatesMatchingJdProfileComponent } from './view-candidates-matching-jd-profile.component';

describe('ViewCandidatesMatchingJdProfileComponent', () => {
  let component: ViewCandidatesMatchingJdProfileComponent;
  let fixture: ComponentFixture<ViewCandidatesMatchingJdProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCandidatesMatchingJdProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidatesMatchingJdProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
