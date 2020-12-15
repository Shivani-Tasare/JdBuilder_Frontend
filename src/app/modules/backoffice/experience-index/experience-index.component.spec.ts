import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceIndexComponent } from './experience-index.component';

describe('ExperienceIndexComponent', () => {
  let component: ExperienceIndexComponent;
  let fixture: ComponentFixture<ExperienceIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
