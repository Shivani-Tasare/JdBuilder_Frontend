import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedTagViewComponent } from './suggested-tag-view.component';

describe('SuggestedTagViewComponent', () => {
  let component: SuggestedTagViewComponent;
  let fixture: ComponentFixture<SuggestedTagViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedTagViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedTagViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
