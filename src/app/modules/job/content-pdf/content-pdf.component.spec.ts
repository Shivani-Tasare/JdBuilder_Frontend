import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPdfComponent } from './content-pdf.component';

describe('ContentPdfComponent', () => {
  let component: ContentPdfComponent;
  let fixture: ComponentFixture<ContentPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
