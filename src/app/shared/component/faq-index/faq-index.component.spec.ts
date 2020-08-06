import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQIndexComponent } from './faq-index.component';

describe('FAQIndexComponent', () => {
  let component: FAQIndexComponent;
  let fixture: ComponentFixture<FAQIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FAQIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FAQIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
