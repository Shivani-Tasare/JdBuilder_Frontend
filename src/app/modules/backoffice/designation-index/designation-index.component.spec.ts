import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationIndexComponent } from './designation-index.component';

describe('DesignationIndexComponent', () => {
  let component: DesignationIndexComponent;
  let fixture: ComponentFixture<DesignationIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
