import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJdComponent } from './view-jd.component';

describe('ViewJdComponent', () => {
  let component: ViewJdComponent;
  let fixture: ComponentFixture<ViewJdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewJdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
