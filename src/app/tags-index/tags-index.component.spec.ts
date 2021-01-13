import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsIndexComponent } from './tags-index.component';

describe('TagsIndexComponent', () => {
  let component: TagsIndexComponent;
  let fixture: ComponentFixture<TagsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
