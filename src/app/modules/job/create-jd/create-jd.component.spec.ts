import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJdComponent } from './create-jd.component';

describe('CreateJdComponent', () => {
  let component: CreateJdComponent;
  let fixture: ComponentFixture<CreateJdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
