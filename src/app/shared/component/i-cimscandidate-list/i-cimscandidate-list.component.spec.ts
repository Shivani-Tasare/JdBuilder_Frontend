import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ICIMSCandidateListComponent } from './i-cimscandidate-list.component';

describe('ICIMSCandidateListComponent', () => {
  let component: ICIMSCandidateListComponent;
  let fixture: ComponentFixture<ICIMSCandidateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ICIMSCandidateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ICIMSCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
