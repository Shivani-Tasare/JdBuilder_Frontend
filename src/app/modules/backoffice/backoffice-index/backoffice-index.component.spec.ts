import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeIndexComponent } from './backoffice-index.component';

describe('BackofficeIndexComponent', () => {
  let component: BackofficeIndexComponent;
  let fixture: ComponentFixture<BackofficeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
