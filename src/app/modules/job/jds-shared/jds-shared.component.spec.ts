import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JdsSharedComponent } from './jds-shared.component';

describe('JdsSharedComponent', () => {
  let component: JdsSharedComponent;
  let fixture: ComponentFixture<JdsSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JdsSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JdsSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
