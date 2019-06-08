import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationFilterComponent } from './annotation-filter.component';

describe('AnnotationFilterComponent', () => {
  let component: AnnotationFilterComponent;
  let fixture: ComponentFixture<AnnotationFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
