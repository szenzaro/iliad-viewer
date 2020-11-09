import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationModalComponent } from './annotation-modal.component';

describe('AnnotationModalComponent', () => {
  let component: AnnotationModalComponent;
  let fixture: ComponentFixture<AnnotationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
