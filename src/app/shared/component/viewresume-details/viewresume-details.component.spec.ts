import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewresumeDetailsComponent } from './viewresume-details.component';

describe('ViewresumeDetailsComponent', () => {
  let component: ViewresumeDetailsComponent;
  let fixture: ComponentFixture<ViewresumeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewresumeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewresumeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
